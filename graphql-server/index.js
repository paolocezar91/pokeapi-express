const { ApolloServer } = require('apollo-server');
const { Pool } = require('pg');
const { userTypeDefs, userResolvers } = require('./user');
const { userSettingsTypeDefs, userSettingsResolvers } = require('./userSettings');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Merge typeDefs and resolvers
const typeDefs = [
  userTypeDefs,
  userSettingsTypeDefs
];

const resolvers = [
  userResolvers,
  userSettingsResolvers
];

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ pool })
});

server.listen({ port: 5678 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});