import express from 'express';
import { gql } from 'graphql-request';
import { type ApiError, requestGraphQL } from '../utils.js';

export function userRoutes(app: express.Express) {
  app.get('/api/user/:email', async (
    req: express.Request<{ email: string }>,
    res: express.Response<{ id: string, email: string } | ApiError>
  ) => {
    const { email } = req.params;
    const query = gql`
      query ($email: String!) { 
        user(email: $email) {
          id,
          email
        }
      }
    `;
    const queryParams = { email };
    try {
      const data = await requestGraphQL<{user: { id: string, email: string } }>(query, queryParams);
      res.json(data.user);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

   app.post('/api/user/', async (
    req: express.Request,
    res: express.Response
  ) => {
    const { email } = req.body;
    
    const mutation = gql`
      mutation ($email: String!) {
        createUser(email: $email) {
          id
          email
        }
      }
    `;

    try { 
      const data = await requestGraphQL<{ createUser: { id: string, email: string } }>(mutation, { email });
      res.json(data.createUser);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  return app;
}