import "../styles/modal.css";
import "../styles/types.css";
import { useState, useEffect } from "react";
import { TiTimes } from "react-icons/ti";
import { IoSparklesSharp } from "react-icons/io5";
import { calcDebilities } from "../utils/type.utils";
import { PokemonStats } from "./PokemonStats";
import { PokemonMoveset } from "./PokemonMoveset";

export function PokemonModal({ showModal, pokemonData, shiny }) {
  const [isShiny, setIsShiny] = useState(shiny);
  const [debilities, setDebilities] = useState({});
  const [pokemondata, setpokemondata] = useState([]);

  function exitModal() {
    showModal();
  }

  useEffect(() => {
    setDebilities(
      calcDebilities(
        pokemonData.data.types?.[0]?.type?.name,
        pokemonData.data.types?.[1]?.type?.name
      )
    );

    const updatedAbilities = pokemonData.data.abilities.map((ability) => ({
      ...ability,
      effect: {}, // Inicializa el campo 'effect' para evitar errores.
    }));

    updatedAbilities.forEach((ability, index) => {
      fetch(ability.ability.url)
        .then((response) => response.json())
        .then((data) => {
          updatedAbilities[index].effect = data.effect_entries[1];
          setpokemondata((prevData) => ({
            ...prevData,
            data: {
              ...prevData.data,
              abilities: updatedAbilities,
            },
          }));
        });
    });
  }, [showModal]);

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleContainer">
          <h1>
            {pokemonData.name.charAt(0).toUpperCase() +
              pokemonData.name.slice(1)}{" "}
            #{pokemonData.data?.id}
          </h1>
          <div className="typeContainer">
            <div className={pokemonData.data?.types?.[0]?.type?.name + " type"}>
              {pokemonData.data?.types?.[0]?.type?.name}
            </div>
            <div className={pokemonData.data?.types?.[1]?.type?.name + " type"}>
              {pokemonData.data?.types?.[1]?.type?.name}
            </div>
          </div>
        </div>
        <div className="pokemonData">
          <div className="dataTitle">Height:</div>
          <div className="dataValue">{pokemonData.data?.height / 10} m</div>
          <div className="dataTitle">Weight:</div>
          <div className="dataValue">{pokemonData.data?.weight / 10} kg</div>
        </div>
        <div className="imageDebilities">
          <div className="imageContainer">
            <img
              src={
                pokemonData.data?.sprites?.other?.["official-artwork"]?.[
                  isShiny ? "front_shiny" : "front_default"
                ]
              }
              alt=""
            />
          </div>
          <div className="debilitiesContainer">
            <h2>Debilities</h2>
            {Object.keys(debilities).map((key) => (
              <div key={key} className="debilities">
                <h3 className="damagesTitle">{key == "0" && "No Damage"}</h3>
                <h3 className="damagesTitle">
                  {key == "0.5" && "Half Damage"}
                </h3>
                <h3 className="damagesTitle">
                  {key == "2" && "Double Damage"}
                </h3>
                <h3 className="damagesTitle">
                  {key == "4" && "Quadruple Damage"}
                </h3>
                <h3 className="damagesTitle">
                  {key == "0.25" && "Quarter Damage"}
                </h3>
                <hr />
                {debilities[key].map((type, index) => (
                  <div
                    key={key + "_" + index}
                    className={type + " type debility"}
                  >
                    {type}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="abilitiesStatsContainer">
          <div className="abilitiesContainer">
            <h2>Abilities</h2>
            {pokemondata.data?.abilities.map((ability, index) => (
              <div key={index} className="ability">
                <h4>
                  {ability.ability.name.charAt(0).toUpperCase() +
                    ability.ability.name.slice(1)}{" "}
                  {ability.is_hidden && "(Hidden)"}:
                </h4>
                <p>{ability.effect?.effect}</p>
              </div>
            ))}
          </div>

          <PokemonStats stats={pokemonData.data?.stats} />
        </div>
        <PokemonMoveset pokemonData={pokemonData.data}></PokemonMoveset>
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
      </div>
      <button className="closeButton" onClick={exitModal}>
        <TiTimes />
      </button>
    </div>
  );
}
