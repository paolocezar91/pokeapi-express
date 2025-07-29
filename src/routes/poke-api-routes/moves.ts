import express from 'express';
import { gql } from 'graphql-request';
import { type ApiError, requestGraphQL, type ResultsCount } from '../utils.ts';
import { type Move } from 'pokeapi-typescript';



export function movesRoutes(app: express.Express) {
  app.get('/api/moves/:id', async (
    req: express.Request<{ id: string }>,
    res: express.Response<Move | ApiError>
  ) => {
    const { id } = req.params;
    const name = isNaN(Number(id)) ? id : '';
    const queryParams = { name, id: isNaN(Number(id)) ? undefined : Number(id) }
    const query = gql`
      query ($id: Int, $name: String) {
        moveById(id: $id, name: $name) {
          id
          name
          id
          name
          power
          accuracy
          pp
          learned_by_pokemon {
            name
            url
          }
          target {
            name
            url
          }
          flavor_text_entries {
            flavor_text
            language {
              name
            }
            version_group {
              name
            }
          }
          type {
            name
            url
          }
          damage_class {
            name
          }
          effect_entries {
            language {
              name
            } 
            effect
          }
        }
      }
    `;
    try {
      const data = await requestGraphQL<{moveById: Move}>(query, queryParams);
      res.json(data.moveById);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  app.get('/api/moves', async (
    req: express.Request<{ ids: string }>,
    res: express.Response<ResultsCount<Move> | ApiError>
  ) => {
    const { ids = '' } = req.query;
    if(!ids) {
      const query = gql`
        query {
          moves {
            id
            name
          }
        }
      `;
  
      try {
        const data = await requestGraphQL<{moves: Move[]}>(query);
        const response = {
          count: data.moves.length,
          results: data.moves
        };
        
        res.json(response);
      } catch (err) {
        res.status(500).json({ error: 'GraphQL error', err });
      }
    } else {
        console.log({ids})
      const query = gql`
        query ($ids: [ID]) {
          movesByIds(ids: $ids) {
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
  
      try {
        const data = await requestGraphQL<{movesByIds: Move[]}>(query, queryParams);
        const response = {
          count: data.movesByIds.length,
          results: data.movesByIds
        };
        
        res.json(response);
      } catch (err) {
        res.status(500).json({ error: 'GraphQL error', err });
      }
    }
  });

  return app;
}