import express from 'express';
import { request, gql } from 'graphql-request';

type Data = Record<string, Record<string, unknown>>;

export function pokemonTypeRoutes(app: express.Express) {
  app.get('/api/type/:id', async (
    req: express.Request<{ id: string }>,
    res: express.Response<Record<string, unknown>>
  ) => {
    const { id } = req.params;
    const name = isNaN(Number(id)) ? id : '';
    const params = { name, id: isNaN(Number(id)) ? undefined : Number(id) }

    const query = gql`
      query ($id: Int, $name: String) {
        pokemonType(id: $id, name: $name) {
          id
          name
        }
      }
    `;

    try {
      const data: Data = await request('http://localhost:5678/', query, params);
      res.json(data.pokemonType);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  app.get('/api/type', async (
    _,
    res: express.Response<Record<string, unknown>>
  ) => {
    const query = gql`
      query {
        types {
          id
          name
        }
      }
    `;

    try {
      const data: Data = await request('http://localhost:5678/', query, {});
      res.json(data.types);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  return app;
}