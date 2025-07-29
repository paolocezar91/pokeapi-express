import express from 'express';
import { gql } from 'graphql-request';
import { type Machine } from 'pokeapi-typescript';
import { type ApiError, formatResultsCount, requestGraphQL, type ResultsCount } from '../utils.js';

export function machinesRoutes(app: express.Express) {
  app.get('/api/machines', async (
    req: express.Request<{ ids: string }>,
    res: express.Response<ResultsCount<Machine> | ApiError>
  ) => {
    const { ids = '' } = req.query;
    const query = gql`
      query ($ids: [ID]) {
        machinesByIds(ids: $ids) {
          machine {
            url
          }
          version_group {
            name
            url
          }
          item {
            name
            url
          }
          id
          move {
            name
            url
          }
        }
      }
    `;

    // parsing to match graphql
    const queryParams = { ids: (ids as string).split(',').map(id => Number(id)) };
    try {
      const data = await requestGraphQL<{machinesByIds: Machine[]}>(query, queryParams);
      res.json(formatResultsCount(data.machinesByIds));
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  return app;
}