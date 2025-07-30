import express from 'express';
import { gql } from 'graphql-request';
import { MoveTarget } from 'pokeapi-typescript';
import { requestGraphQL, type ApiError } from '../utils.js';

export function moveTargetRoutes(app: express.Express) {
  app.get('/api/move-target/:id', async (
    req: express.Request<{ id: string }>,
    res: express.Response<MoveTarget | ApiError>
  ) => {
    const { id } = req.params;
    const name = isNaN(Number(id)) ? id : '';
    const queryParams = { name, id: isNaN(Number(id)) ? undefined : Number(id) }
    const query = gql`
      query ($id: ID!) {
        moveTargetById(id: $id) {
          id
          name
          descriptions {
            language {
              name
            }
            description
          }
          moves {
            name
            url
          }
        }
      }
    `;

    try {
      const data = await requestGraphQL<{moveTargetById: MoveTarget}>(query, queryParams);
      res.json(data.moveTargetById);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  return app;
}