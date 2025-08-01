import express from 'express';
import { gql } from 'graphql-request';
import { type PokemonForm } from 'pokeapi-typescript';
import { type ApiError, formatResultsCount, requestGraphQL, type ResultsCount } from '../utils.js';

export function pokemonFormRoutes(app: express.Express) {
  app.get('/api/pokemon-form', async (
    req: express.Request<{ ids: string }>,
    res: express.Response<ResultsCount<PokemonForm> | ApiError>
  ) => {
    const { ids = '' } = req.query;
    const query = gql`
      query ($ids: [ID]) {
        pokemonFormByIds(ids: $ids) {
          id
          name
          is_mega
          is_default
        }
      }
    `;

    // parsing to match graphql
    const queryParams = { ids: (ids as string).split(',').map(id => Number(id)) };
    try {
      const data = await requestGraphQL<{pokemonFormByIds: PokemonForm[]}>(query, queryParams);
      res.json(formatResultsCount(data.pokemonFormByIds));
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  return app;
}