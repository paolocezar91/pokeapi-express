import express from 'express';
import { request, gql } from 'graphql-request';

type Data = Record<string, Record<string, unknown>>;

export function userRoutes(app: express.Express) {
  app.get('/api/user/:email', async (
    req: express.Request<{ email: string }>,
    res: express.Response<Record<string, unknown>>
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

    try {
      const data: Data = await request('http://localhost:5678/', query, { email });
      res.json(data.user);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error' });
    }
  });

   app.post('/api/user/', async (
    req: express.Request,
    res: express.Response<Record<string, unknown>>
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
      const data: Data = await request('http://localhost:5678/', mutation, { email });
      res.json(data.createUser);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error' });
    }
  });

  return app;
}