import { useEffect, useState } from "react";
import { PokemonCard } from "./PokemonCard";
import { PokemonModal } from "./PokemonModal";
import { types } from "../utils/type.utils";
import { IoSparklesSharp } from "react-icons/io5";

import "../styles/general.css";

export function PokemonContainer() {
  const [pokemonList, setPokemonList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pokemonData, setPokemonData] = useState({});
  const [isShiny, setIsShiny] = useState(false);
  const [gen, setGen] = useState("Gen 1");
  const [typesToFilter, setTypesToFilter] = useState([]);
  const [typeFilter1, setTypeFilter1] = useState("All");
  const [typeFilter2, setTypeFilter2] = useState("All");

  function calculateGen() {
    switch (gen) {
      case "Gen 1":
        return [0, 151];
      case "Gen 2":
        return [151, 100];
      case "Gen 3":
        return [251, 135];
      case "Gen 4":
        return [386, 107];
      case "Gen 5":
        return [493, 156];
      case "Gen 6":
        return [649, 72];
      case "Gen 7":
        return [721, 88];
      case "Gen 8":
        return [809, 96];
      case "Gen 9":
        return [905, 120];
      default:
        return [0, 1025];
    }
  }

  function getTypes() {
    const typesNames = ["All"];
    for (const move of types) {
      typesNames.push(move.name);
    }
    return typesNames;
  }

  function getPokemonID(url) {
    return url.split("/")[6];
  }

  function getGenMax() {
    switch (gen) {
      case "Gen 1":
        return 151;
      case "Gen 2":
        return 251;
      case "Gen 3":
        return 386;
      case "Gen 4":
        return 493;
      case "Gen 5":
        return 649;
      case "Gen 6":
        return 721;
      case "Gen 7":
        return 809;
      case "Gen 8":
        return 905;
      case "Gen 9":
        return 1025;
      default:
        return 1025;
    }
  }

  function getGenMin() {
    switch (gen) {
      case "Gen 1":
        return 0;
      case "Gen 2":
        return 151;
      case "Gen 3":
        return 251;
      case "Gen 4":
        return 386;
      case "Gen 5":
        return 493;
      case "Gen 6":
        return 649;
      case "Gen 7":
        return 721;
      case "Gen 8":
        return 809;
      case "Gen 9":
        return 905;
      default:
        return 0;
    }
  }

  function filterAll() {
    if (typeFilter1 === "All") {
      const [min, max] = calculateGen();

      fetch(`https://pokeapi.co/api/v2/pokemon?limit=${max}&offset=${min}`)
        .then((response) => response.json())
        .then((data) => {
          setPokemonList(data.results);
        });
      setTypeFilter2("All");
      return;
    }
    const pokemon = [];
    fetch(`https://pokeapi.co/api/v2/type/${typeFilter1.toLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        for (const poke of data.pokemon) {
          pokemon.push(poke.pokemon);
        }
        if (typeFilter2 == "All") {
          filterByGen(pokemon);

        } else {
          const pokemon2 = [];
          fetch(`https://pokeapi.co/api/v2/type/${typeFilter2.toLowerCase()}`)
            .then((response) => response.json())
            .then((data) => {
              for (const poke of data.pokemon) {
                pokemon2.push(poke.pokemon);
              }
              const filteredPokemon = pokemon.filter((poke) =>
                pokemon2.some((poke2) => poke2.name === poke.name)
              );
              filterByGen(filteredPokemon);
            });
        }
      });


  }

  function filterByGen(filteredPokemon) {
    const pokemonAux = []
    for (const poke of filteredPokemon) {
      if (gen === "All") {
        pokemonAux.push(poke);
        continue;
      }
      if (Number(getPokemonID(poke.url)) > getGenMax() || Number(getPokemonID(poke.url)) < getGenMin()) {
        continue;
      }
      pokemonAux.push(poke);
    }
    setPokemonList(pokemonAux);
  }

  useEffect(() => {
    filterAll();
  }, [typeFilter1, typeFilter2, gen]);

  useEffect(() => {
    const allTypes = getTypes();
    setTypesToFilter(allTypes);
  }, []);

  function showModall(pokemonData) {
    setPokemonData(pokemonData);
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  return (
    <>
      <div className="titleAndSelector">
        <h1>Pokemon</h1>
        <select
          onChange={(e) => setGen(e.target.value)}
          value={gen}
          className="selectorGen"
        >
          <option value="Gen 1">Gen 1</option>
          <option value="Gen 2">Gen 2</option>
          <option value="Gen 3">Gen 3</option>
          <option value="Gen 4">Gen 4</option>
          <option value="Gen 5">Gen 5</option>
          <option value="Gen 6">Gen 6</option>
          <option value="Gen 7">Gen 7</option>
          <option value="Gen 8">Gen 8</option>
          <option value="Gen 9">Gen 9</option>
          <option value="All">All</option>
        </select>

        <div className="typesSelectorContainer">
          <h3>Types</h3>
          <select
            className="selectorType"
            value={typeFilter1}
            onChange={(e) => {
              setTypeFilter1(e.target.value);
            }}
          >
            {typesToFilter.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <select
            className="selectorType"
            value={typeFilter2}
            onChange={(e) => {
              setTypeFilter2(e.target.value);
            }}
          >
            {typesToFilter.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        className="shinyButton"
        onClick={() => {
          setIsShiny(!isShiny);
        }}
        style={{
          color: isShiny ? "rgb(252, 255, 168)" : "rgb(26, 25, 25)",
          backgroundColor: isShiny ? "rgb(26, 25, 25)" : "rgb(252, 255, 168)",
        }}
      >
        <IoSparklesSharp />
      </button>
      {showModal && (
        <PokemonModal
          showModal={closeModal}
          pokemonData={pokemonData}
          shiny={isShiny}
        />
      )}
      <div className="pokemonContainer">
        {pokemonList.map((pokemon) => (
          <PokemonCard
            key={pokemon.url}
            pokemon={pokemon}
            showModal={showModall}
            isShiny={isShiny}
          />
        ))}
      </div>
    </>
  );
}
