const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const { userTypeDefs, userResolvers } = require('./resolvers/userResolver');
const { userSettingsTypeDefs, userSettingsResolvers } = require('./resolvers/userSettingsResolver');
const { pokemonTypeDefs, pokemonResolvers } = require('./resolvers/pokeApi/pokemonResolver');

// Merge typeDefs and resolvers
const typeDefs = [
  userTypeDefs,
  userSettingsTypeDefs,
  pokemonTypeDefs
];

const resolvers = [
  userResolvers,
  userSettingsResolvers,
  pokemonResolvers
];

async function startServer() {
  await mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context: () => ({}) // Only needed if you want to pass custom context
  });

  server.listen({ port: 5678 }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

startServer();