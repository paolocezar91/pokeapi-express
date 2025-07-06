const { gql } = require('apollo-server');
const PokemonType = require('../../models/pokeApi/pokemonTypeModel');

const pokemonTypeTypeDefs = gql`
  type PokemonType {
    id: Int
    name: String
  }

  type Query {
    types: [PokemonType]
    pokemonType(id: Int, name: String): PokemonType
  }
`;

const pokemonTypeResolvers = {
  Query: {
    types: async () => {
      const projection = { id: 1, name: 1 };
      const types = await PokemonType.find({}, projection)
        .limit(18)
        .lean();

      return types;
    },
    pokemonType: async (_, { id, name }) => {
      const query = name ? { name } : { id };
      const projection = { id: 1, name: 1 };
      return await PokemonType.findOne(query, projection).lean();
    },
  },
};

module.exports = { pokemonTypeTypeDefs, pokemonTypeResolvers };