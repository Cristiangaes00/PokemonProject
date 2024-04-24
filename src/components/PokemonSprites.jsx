import { useState, useEffect } from "react";

function getSprite(pokemonData, sprite, isShiny) {
  return isShiny
    ? pokemonData.data.sprites.other[`${sprite}`]?.front_shiny
      ? pokemonData.data.sprites.other[`${sprite}`].front_shiny
      : pokemonData.data.sprites.other[`${sprite}`].front_default
    : pokemonData.data.sprites.other[`${sprite}`].front_default;
}

export function PokemonSprites({ pokemonData, isShiny }) {
  const [sprites, setSprites] = useState([]);

  useEffect(() => {
    const spritesToAdd = [];
    for (let key in pokemonData.data.sprites.versions) {
      for (let sprite in pokemonData.data.sprites.versions[key]) {
        spritesToAdd.push({
          game: sprite,
          url: isShiny
            ? pokemonData.data.sprites.versions[key][sprite].front_shiny
              ? pokemonData.data.sprites.versions[key][sprite].front_shiny
              : pokemonData.data.sprites.versions[key][sprite].front_default
            : pokemonData.data.sprites.versions[key][sprite].front_default,
        });
      }
    }
    setSprites(spritesToAdd);
  }, []);
  return (
    <>
      <div style={{ display: "flex" }}>
        {/* <img
          style={{ width: "80%", height: "auto" }}
          src={getSprite(pokemonData, "dream_world", isShiny)}
          alt="front_default"
        />
        <img
          style={{ width: "80%", height: "auto" }}
          src={getSprite(pokemonData, "home", isShiny)}
          alt="front_default"
        />
        <img
          style={{ width: "80%", height: "auto" }}
          src={getSprite(pokemonData, "showdown", isShiny)}
          alt="front_default"
        /> */}
        {/* {sprites.map((sprite) => (
          <img
            style={{ width: "400px", height: "auto"}}
            src={sprite.url}
            alt="front_default"
          />
        ))} */}
      </div>
    </>
  );
}
