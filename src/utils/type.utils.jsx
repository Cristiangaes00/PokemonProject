export function calcDebilities(type1, type2) {
  let typeList = types.map((type) => {
    return {name: type.name};
  });
  typeList.forEach((type) => {
    type.damage = 1;
  });
  
  typeList.forEach((type, index) => {
    if (type1 === type.name ) {
      types[index].damage_relations.double_damage_from.forEach((type) => {
        let index = typeList.findIndex((element) => element.name === type);
        typeList[index].damage *= 2;
      });
      types[index].damage_relations.half_damage_from.forEach((type) => {
        let index = typeList.findIndex((element) => element.name === type);
        typeList[index].damage *= 0.5;
      });
      types[index].damage_relations.no_damage_from.forEach((type) => {
        let index = typeList.findIndex((element) => element.name === type);
        typeList[index].damage *= 0;
      });

    }
    if (type2 === type.name ) {
      types[index].damage_relations.double_damage_from.forEach((type) => {
        let index = typeList.findIndex((element) => element.name === type);
        typeList[index].damage *= 2;
      });
      types[index].damage_relations.half_damage_from.forEach((type) => {
        let index = typeList.findIndex((element) => element.name === type);
        typeList[index].damage *= 0.5;
      });
      (types[index].damage_relations.no_damage_from);
      types[index].damage_relations.no_damage_from.forEach((type) => {
        let index = typeList.findIndex((element) => element.name === type);

        typeList[index].damage *= 0;
      });
    }
    
  });

  typeList = typeList.filter((type) => type.damage !== 1);
  typeList = groupByDamage(typeList);
  return typeList;
}

function groupByDamage(types) {
  return types.reduce((acc, { name, damage }) => {
    // Si no existe la clave para ese damage, inicialízala con un arreglo vacío
    if (!acc[damage]) {
      acc[damage] = [];
    }
    // Agrega el nombre del tipo al arreglo correspondiente
    acc[damage].push(name);
    return acc;
  }, {});
}

export const types =[
  {name: "normal", damage_relations: {double_damage_from: ["fighting"], half_damage_from: [], no_damage_from: ["ghost"]}},
  {name: "fighting", damage_relations: {double_damage_from: ["fairy", "flying", "psychic"], half_damage_from: ["bug", "dark", "rock"], no_damage_from: []}},
  {name: "fairy", damage_relations: {double_damage_from: ["poison", "steel"], half_damage_from: ["bug", "dark", "fighting"], no_damage_from: []}},
  {name: "flying", damage_relations: {double_damage_from: ["electric", "ice", "rock"], half_damage_from: ["bug", "fighting", "grass"], no_damage_from: []}},
  {name: "psychic", damage_relations: {double_damage_from: ["bug", "dark", "ghost"], half_damage_from: ["fighting", "psychic"], no_damage_from: []}},
  {name: "poison", damage_relations: {double_damage_from: ["ground", "psychic"], half_damage_from: ["bug", "fairy", "fighting", "grass"], no_damage_from: []}},
  {name: "steel", damage_relations: {double_damage_from: ["fighting", "fire", "ground"], half_damage_from: ["bug", "dragon", "fairy", "flying", "grass", "ice", "normal", "psychic", "rock", "steel"], no_damage_from: ["poison"]}},
  {name: "bug", damage_relations: {double_damage_from: ["fire", "flying", "rock"], half_damage_from: ["fighting", "grass", "ground"], no_damage_from: []}},
  {name: "dark", damage_relations: {double_damage_from: ["bug", "fighting", "fairy"], half_damage_from: ["dark", "ghost"], no_damage_from: ["psychic"]}},
  {name: "dragon", damage_relations: {double_damage_from: ["dragon", "fairy", "ice"], half_damage_from: ["electric", "fire", "grass", "water"], no_damage_from: []}},
  {name: "electric", damage_relations: {double_damage_from: ["ground"], half_damage_from: ["electric", "flying", "steel"], no_damage_from: []}},
  {name: "fire", damage_relations: {double_damage_from: ["ground", "rock", "water"], half_damage_from: ["bug", "fairy", "fire", "grass", "ice", "steel"], no_damage_from: []}},
  {name: "ghost", damage_relations: {double_damage_from: ["dark", "ghost"], half_damage_from: ["bug", "poison"], no_damage_from: ["normal", "fighting"]}},
  {name: "grass", damage_relations: {double_damage_from: ["bug", "fire", "flying", "ice", "poison"], half_damage_from: ["electric", "grass", "ground", "water"], no_damage_from: []}},
  {name: "ice", damage_relations: {double_damage_from: ["fighting", "fire", "rock", "steel"], half_damage_from: ["ice"], no_damage_from: []}},
  {name: "rock", damage_relations: {double_damage_from: ["fighting", "grass", "ground", "steel", "water"], half_damage_from: ["fire", "flying", "normal", "poison"], no_damage_from: []}},
  {name: "water", damage_relations: {double_damage_from: ["electric", "grass"], half_damage_from: ["fire", "ice", "steel", "water"], no_damage_from: []}},
  {name: "ground", damage_relations: {double_damage_from: ["grass", "ice", "water"], half_damage_from: ["poison", "rock"], no_damage_from: ["electric"]}},
];
