const { gql } = require('apollo-server');
const Moves = require('../../models/poke-api/moves.model');

const movesResolvers = {
  Query: {
    moves: async () => {
      const moves = await Moves.find().lean();
      return moves;
    },
    move: async (_, { id, name }) => {
      const query = name ? { name } : { id };
      const move = await Moves.findOne(query).lean();
      return move;
    },
    movesMany: async (_, { ids }) => {
      const query = { id: { $in: ids.map(Number) } };
      return await Moves.find(query).sort({id: 1}).lean();
    }
  },
};

const movesTypeDefs = gql`
  type LearnedByPokemon {
    name: String
    url: String
  }

  type Target {
    name: String
    url: String
  }

  type Language {
    name: String
  }

  type VersionGroup {
    name: String
  }

  type FlavorTextEntries {
    flavor_text: String
    language: Language
    version_group: VersionGroup
  }

  type Type {
    name: String
    url: String
  }

  type DamageClass {
    name: String
  }

  type EffectEntries {
    language: Language
    effect: String
  }

  type Move {
    id: Int
    name: String
    power: Int
    accuracy: Int
    pp: Int
    learned_by_pokemon: [LearnedByPokemon]
    target: Target
    flavor_text_entries: [FlavorTextEntries]
    type: Type
    damage_class: DamageClass
    effect_entries: [EffectEntries]
  }

  type Query {
    moves: [Move]
    movesMany(ids: [ID]): [Move]
    move(id: Int, name: String): Move
  }
`;

module.exports = { movesTypeDefs, movesResolvers };