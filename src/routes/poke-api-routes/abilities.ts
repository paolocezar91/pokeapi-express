import express from 'express';
import { gql } from 'graphql-request';
import { type ApiError, requestGraphQL } from '../utils.ts';
import { type Ability } from 'pokeapi-typescript';



export function abiltiesRoutes(app: express.Express) {
  app.get('/api/abilities/:id', async (
    req: express.Request<{ id: string }>,
    res: express.Response<Ability | ApiError>
  ) => {
    const { id } = req.params;
    const name = isNaN(Number(id)) ? id : '';
    const queryParams = { name, id: isNaN(Number(id)) ? undefined : Number(id) };

    const query = gql`
      query ($id: Int, $name: String) { 
        abilityById(id: $id, name: $name) {
            id
            name
            effect_entries {
              effect
              short_effect
              language {
                  name
              }
            }
        }
      }
    `;

    try {
      const data = await requestGraphQL<{abilityById: Ability}>(query, queryParams);
      res.json(data.abilityById);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  return app;
}