import { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';
import "../styles/types.css";

export function PokemonCard({ pokemon, showModal, isShiny }) {
  const [pokemonData, setPokemonData] = useState(pokemon);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1 
  });

  useEffect(() => {
    if (inView) {
      fetch(pokemon.url)
        .then((response) => response.json())
        .then((data) => {
          setPokemonData({ ...pokemon, data });
        });
    }
  }, [inView, pokemon.url]);

  function showMod() {
    showModal(pokemonData);
  }

  return (
    <div ref={ref} className="card" onClick={showMod}>
      <div className="cardContent">
        <div className="cardTitle">
          {pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}
        </div>
        <img
          src={
            pokemonData.data?.sprites?.other?.["official-artwork"]?.[
              isShiny ? "front_shiny" : "front_default"
            ]
          }
          alt=""
          width={"150px"}
        />
        <div className="typeContainer" style={{ justifyContent: "center" }}>
          <div className={pokemonData.data?.types?.[0]?.type?.name + " type"}>
            {pokemonData.data?.types?.[0]?.type?.name}
          </div>
          <div className={pokemonData.data?.types?.[1]?.type?.name + " type"}>
            {pokemonData.data?.types?.[1]?.type?.name}
          </div>
        </div>
      </div>
    </div>
  );
}
