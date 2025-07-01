const { gql } = require('apollo-server');

const userTypeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type Query {
    users: [User]
    user(email: String!): User
  }

  type Mutation {
    createUser(email: String!): User
    deleteUser(id: ID!): Boolean
  }
`;

const userResolvers = {
  Query: {
    users: async (_, __, { pool }) => {
      const res = await pool.query('SELECT * FROM users');
      return res.rows;
    },
    user: async (_, { email }, { pool }) => {
      const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return res.rows[0];
    }
  },
  Mutation: {
    createUser: async (_, { email }, { pool }) => {
      const res = await pool.query(
        'INSERT INTO users (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email RETURNING *',
        [email]
      );
      return res.rows[0];
    },
    deleteUser: async (_, { id }, { pool }) => {
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    }
  }
};

module.exports = { userTypeDefs, userResolvers };