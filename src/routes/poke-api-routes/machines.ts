import express from 'express';
import { gql } from 'graphql-request';
import { type Machine } from 'pokeapi-typescript';
import { type ApiError, formatResultsCount, requestGraphQL, type ResultsCount } from '../utils.ts';

export function machinesRoutes(app: express.Express) {
  app.get('/api/machines', async (
    req: express.Request<{ ids: string }>,
    res: express.Response<ResultsCount<Machine> | ApiError>
  ) => {
    const { ids = '' } = req.query;
    const query = gql`
      query ($ids: [ID]) {
        machinesByIds(ids: $ids) {
          id
          name
          power
          pp
          accuracy
          damage_class {
            name
          }
          type {
            name
            url
          }
          machines {
            machine {
              url
            }
            version_group {
              name
              url
            }
          }
        }
      }
    `;

    // parsing to match graphql
    const queryParams = { ids: (ids as string).split(',') };
    console.log({ queryParams })
    try {
      const data = await requestGraphQL<{machinesByIds: Machine[]}>(query, queryParams);
      res.json(formatResultsCount(data.machinesByIds));
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  return app;
}