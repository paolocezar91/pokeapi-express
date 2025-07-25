const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { userTypeDefs, userResolvers } = require('./resolvers/user/user.resolver');
const { userSettingsTypeDefs, userSettingsResolvers } = require('./resolvers/user/user-settings.resolver');
const { pokemonTypeDefs, pokemonResolvers } = require('./resolvers/poke-api/pokemon.resolver');
const { pokemonSpeciesTypeDefs, pokemonSpeciesResolvers } = require('./resolvers/poke-api/pokemon-species.resolver');
const { typesTypeDefs, typesResolvers } = require('./resolvers/poke-api/types.resolver');
const { movesTypeDefs, movesResolvers  } = require('./resolvers/poke-api/moves.resolver');
const { evolutionChainResolvers, evolutionChainTypeDefs } = require('./resolvers/poke-api/evolution-chain.resolver');
const { abilitiesResolvers, abilitiesTypeDefs } = require('./resolvers/poke-api/ability.resolver');

// Merge typeDefs and resolvers
const typeDefs = [
  userTypeDefs,
  userSettingsTypeDefs,
  pokemonTypeDefs,
  pokemonSpeciesTypeDefs,
  typesTypeDefs,
  movesTypeDefs,
  evolutionChainTypeDefs,
  abilitiesTypeDefs
];

const resolvers = [
  userResolvers,
  userSettingsResolvers,
  pokemonResolvers,
  pokemonSpeciesResolvers,
  typesResolvers,
  movesResolvers,
  evolutionChainResolvers,
  abilitiesResolvers
];

async function startServer() {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  server.listen({ port: 5678 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

startServer();