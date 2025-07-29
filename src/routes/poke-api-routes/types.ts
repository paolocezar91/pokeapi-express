import express from 'express';
import { gql } from 'graphql-request';
import { type ApiError, requestGraphQL } from '../utils.ts';
import { type Type } from 'pokeapi-typescript';

export function typesRoutes(app: express.Express) {
  app.get('/api/types/:id', async (
    req: express.Request<{ id: string }>,
    res: express.Response<Type | ApiError>
  ) => {
    const { id } = req.params;
    const name = isNaN(Number(id)) ? id : '';
    const queryParams = { name, id: isNaN(Number(id)) ? undefined : Number(id) }
    const query = gql`
      query ($id: Int, $name: String) {
        pokemonType(id: $id, name: $name) {
          id
          name
          pokemon {
            pokemon { name url }
          }
          moves { name url }
        }
      }
    `;
    try {
      const data = await requestGraphQL<{
        pokemonType: Type
      }>(query, queryParams);
      res.json(data.pokemonType);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  app.get('/api/types', async (
    _,
    res: express.Response
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
      const data = await requestGraphQL<{types: {id: string, name: string}[]}>(query, {});
      res.json(data.types);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  return app;
}