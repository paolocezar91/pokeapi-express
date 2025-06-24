const { gql } = require('apollo-server');

const userTypeDefs = gql`
  type User {
    id: ID!
    github_id: String!
  }

  type Query {
    users: [User]
    user(github_id: String!): User
  }

  type Mutation {
    createUser(github_id: String!): User
    deleteUser(id: ID!): Boolean
  }
`;

const userResolvers = {
  Query: {
    users: async (_, __, { pool }) => {
      const res = await pool.query('SELECT * FROM users');
      return res.rows;
    },
    user: async (_, { github_id }, { pool }) => {
      const res = await pool.query('SELECT * FROM users WHERE github_id = $1', [github_id]);
      return res.rows[0];
    }
  },
  Mutation: {
    createUser: async (_, { github_id }, { pool }) => {
      const res = await pool.query(
        'INSERT INTO users (github_id) VALUES ($1) RETURNING *',
        [github_id]
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