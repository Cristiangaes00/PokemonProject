import { useEffect, useState } from "react";
import "../styles/moveset.css";
import "../styles/types.css";
import { types } from "../utils/type.utils";

export function PokemonMoveset({ pokemonData }) {
  const [moves, setMoves] = useState([]);
  const [filteredMoves, setFilteredMoves] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [movesPerPage] = useState(7);
  const [search, setSearch] = useState("");
  const [methodToSearch, setMethodToSearch] = useState("All");
  const [methods, setMethods] = useState([]);
  const [typesSelect, setTypesSelect] = useState([]);
  const [typeToSearch, setTypeToSearch] = useState("All");
  const [moveClass, setMoveClass] = useState("All");

  function filter() {
    const lowercasedSearch = search.toLowerCase();
    let filtered = moves.filter((move) =>
      move.move.name.toLowerCase().includes(lowercasedSearch)
    );

    if (methodToSearch != "All") {
      filtered = filtered.filter(
        (move) => move.PokemonMoveset.move_learn_method.name === methodToSearch
      );
    }

    if (typeToSearch != "All") {
      filtered = filtered.filter(
        (move) => move.PokemonMoveset.type === typeToSearch
      );
    }

    if (moveClass === "All") {
      setFilteredMoves(filtered);
    } else {
      const filtered2 = filtered.filter(
        (move) => move.PokemonMoveset.damage_class === moveClass
      );
      setFilteredMoves(filtered2);
    }

    setCurrentPage(1);
  }

  useEffect(() => {
    if (!pokemonData.moves) return;

    const differentMethods = new Set();

    const processMoves = async () => {
      const promises = pokemonData.moves.map(async (move) => {
        const details = move.version_group_details[0];
        differentMethods.add(details.move_learn_method.name);

        const response = await fetch(move.move.url);
        const data = await response.json();
        details.type = data.type.name;
        details.accuracy = data.accuracy;
        details.power = data.power;
        details.damage_class = data.damage_class?.name;

        return {
          ...move,
          PokemonMoveset: details,
        };
      });

      const results = await Promise.all(promises);
      const sortedAndFiltered = results
        .sort(
          (a, b) =>
            a.PokemonMoveset.level_learned_at -
            b.PokemonMoveset.level_learned_at
        )
        .filter(
          (move, index, self) =>
            index ===
            self.findIndex(
              (t) => t.move && move.move && t.move.name === move.move.name
            )
        );

      const typesNames = ["All"];
      for (const move of types) {
        typesNames.push(move.name);
      }

      setTypesSelect(typesNames);
      setMethods(["All", ...differentMethods]);
      setMoves(sortedAndFiltered);
      setFilteredMoves(sortedAndFiltered);
    };

    processMoves();
  }, [pokemonData]);

  useEffect(() => {
    filter();
  }, [search, moves, methodToSearch, typeToSearch, moveClass]);

  function getImage(damageClass) {
    if (damageClass === "physical") return "../assets/PhysicalI.png";
    if (damageClass === "special") return "../assets/SpecialI.png";
    if (damageClass === "status") return "../assets/StatusI.png";
  }

  const indexOfLastMove = currentPage * movesPerPage;
  const indexOfFirstMove = indexOfLastMove - movesPerPage;
  const currentMoves = filteredMoves.slice(indexOfFirstMove, indexOfLastMove);

  return (
    <>
      <h2>Moveset</h2>
      <div className="filterContainer">
        <input
          type="text"
          placeholder="Search for moves..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={methodToSearch}
          className="selector"
          onChange={(e) => {
            setMethodToSearch(e.target.value);
          }}
        >
          {methods.map((method, index) => (
            <option key={index} value={method}>
              {method}
            </option>
          ))}
        </select>

        <select
          value={typeToSearch}
          className="selector"
          onChange={(e) => {
            setTypeToSearch(e.target.value);
          }}
        >
          {typesSelect.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>

        <select
          value={moveClass}
          className="selector"
          onChange={(e) => {
            setMoveClass(e.target.value);
          }}
        >
          <option value="All">All</option>
          <option value="physical">Physical</option>
          <option value="special">Special</option>
          <option value="status">Status</option>
        </select>
        <button
          onClick={() => {
            setSearch("");
            setMethodToSearch("All");
            setTypeToSearch("All");
            setMoveClass("All");
          }}
          className="PageSelector"
        >
          Clear Filters
        </button>
      </div>
      <div className="PageSelectorContainer">
        <button
          className="PageSelector"
          onClick={() => {
            currentPage - 1 <= 0 ? null : setCurrentPage(currentPage - 1);
          }}
        >
          Prev
        </button>
        <div className="pages">
          {filteredMoves.length === 0 ? 0 : currentPage}/
          {Math.ceil(filteredMoves.length / movesPerPage)}
        </div>
        <button
          className="PageSelector"
          onClick={() => {
            currentPage + 1 > Math.ceil(filteredMoves.length / movesPerPage)
              ? null
              : setCurrentPage(currentPage + 1);
          }}
        >
          Next
        </button>
      </div>
      {filteredMoves.length === 0 && <h3>No moves found</h3>}
      <table>
        <thead>
          <tr>
            <th>Move</th>
            <th>Level Learned At</th>
            <th>Method</th>
            <th>Type</th>
            <th>Accuracy</th>
            <th>Power</th>
            <th>Damage Class</th>
          </tr>
        </thead>
        <tbody>
          {currentMoves.map((move, index) => (
            <tr key={index}>
              <td>{move.move.name}</td>
              <td>{move.PokemonMoveset.level_learned_at}</td>
              <td>{move.PokemonMoveset.move_learn_method.name}</td>
              <td>
                <div className={move.PokemonMoveset.type + ` type`}>
                  {move.PokemonMoveset.type}
                </div>
              </td>
              <td>
                {move.PokemonMoveset.accuracy
                  ? move.PokemonMoveset.accuracy
                  : 100}
                %
              </td>
              <td>
                {move.PokemonMoveset.power ? move.PokemonMoveset.power : "-"}
              </td>
              <td>
                <img
                  src={getImage(move.PokemonMoveset.damage_class)}
                  width={"40px"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
