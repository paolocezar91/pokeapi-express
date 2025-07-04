const { gql } = require('apollo-server');
const Pokemon = require('../../models/pokeApi/pokemonModel');

const pokemonTypeDefs = gql`
  type AbilityDetail {
    name: String
    url: String
  }

  type Ability {
    ability: AbilityDetail
    is_hidden: Boolean
    slot: Int
  }

  type Cry {
    latest: String
    legacy: String
  }

  type Form {
    name: String
    url: String
  }

  type Version {
    name: String
    url: String
  }

  type GameIndex {
    game_index: Int
    version: Version
  }

  type MoveDetail {
    name: String
    url: String
  }

  type MoveLearnMethod {
    name: String
    url: String
  }

  type VersionGroup {
    name: String
    url: String
  }

  type VersionGroupDetail {
    level_learned_at: Int
    move_learn_method: MoveLearnMethod
    order: Int
    version_group: VersionGroup
  }

  type Move {
    move: MoveDetail
    version_group_details: [VersionGroupDetail]
  }

  type PastAbility {
    abilities: [Ability]
    generation: Version
  }

  type Species {
    name: String
    url: String
  }

  type SpriteOther {
    dream_world: SpriteImage
    home: SpriteImage
    official_artwork: SpriteImage
    showdown: SpriteImage
  }

  type SpriteImage {
    front_default: String
    front_female: String
    front_shiny: String
    front_shiny_female: String
    back_default: String
    back_female: String
    back_shiny: String
    back_shiny_female: String
  }

  type Sprites {
    other: SpriteOther
  }

  type StatDetail {
    name: String
    url: String
  }

  type Stat {
    base_stat: Int
    effort: Int
    stat: StatDetail
  }

  type TypeDetail {
    name: String
    url: String
  }

  type TypeSlot {
    slot: Int
    type: TypeDetail
  }

  type Pokemon {
    id: ID!
    name: String
    base_experience: Int
    height: Int
    weight: Int
    is_default: Boolean
    order: Int
    location_area_encounters: String
    abilities: [Ability]
    cries: Cry
    forms: [Form]
    game_indices: [GameIndex]
    moves: [Move]
    past_abilities: [PastAbility]
    species: Species
    sprites: Sprites
    stats: [Stat]
    types: [TypeSlot]
  }

  type Query {
    pokemonList(limit: Int, offset: Int): [Pokemon]
    pokemon(id: ID, name: String): Pokemon
  }
`;

const pokemonResolvers = {
  Query: {
    pokemonList: async (_, { limit = 50, offset = 0 }) => {
      return await Pokemon.find({}, { id: 1, name: 1, stats: 1, types: 1 })
        .skip(offset)
        .limit(limit)
        .lean();
    },
    pokemon: async (_, { id, name }) => {
      const query = name ? { name } : { id };
      console.log(query);
      const pokemon = await Pokemon.findOne(query).lean();
      console.log({pokemon});
      return pokemon;
    },
  },
};

module.exports = { pokemonTypeDefs, pokemonResolvers };