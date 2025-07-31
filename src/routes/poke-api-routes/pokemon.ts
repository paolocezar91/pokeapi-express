import express from 'express';
import { gql } from 'graphql-request';
import { type Pokemon } from 'pokeapi-typescript';
import { type ApiError, formatResultsCount, requestGraphQL, type ResultsCount } from '../utils.js';

export function pokemonRoutes(app: express.Express) {
  app.get('/api/pokemon/:id', async (
    req: express.Request<{ id: string }>,
    res: express.Response<Pokemon | ApiError>
  ) => {
    const { id } = req.params;
    const name = isNaN(Number(id)) ? id : '';
    const query = gql`
      query ($id: ID, $name: String) { 
        pokemonById(id: $id, name: $name) {
          id
          name
          base_experience
          height
          weight
          is_default
          order
          location_area_encounters
          abilities {
            ability {
              name
              url
            }
            is_hidden
            slot
          }
          cries {
            latest
            legacy
          }
          forms {
            name
            url
          }
          game_indices {
            game_index
            version {
              name
              url
            }
          }
          moves {
            move {
              name
              url
            }
            version_group_details {
              level_learned_at
              move_learn_method {
                name
                url
              }
              order
              version_group {
                name
                url
              }
            }
          }
          past_abilities {
            abilities {
              ability {
                name
                url
              }
              is_hidden
              slot
            }
            generation {
              name
              url
            }
          }
          species {
            name
            url
          }
          sprites {
            other {
              dream_world {
                front_default
                front_female
              }
              home {
                front_default
                front_female
                front_shiny
                front_shiny_female
              }
              official_artwork {
                front_default
                front_shiny
              }
              showdown {
                front_default
                front_female
                front_shiny
                front_shiny_female
                back_default
                back_female
                back_shiny
                back_shiny_female
              }
            }
          }
          stats {
            base_stat
            effort
            stat {
              name
              url
            }
          }
          types {
            slot
            type {
              name
              url
            }
          }
        }
      }
    `;
    const queryParams = { name, id: isNaN(Number(id)) ? undefined : Number(id) };
    
    try {
      const data = await requestGraphQL<{ pokemonById: Pokemon }>(query, queryParams);
      res.json(data.pokemonById);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  app.get('/api/pokemon', async (
    req: express.Request<{ ids: string }>,
    res: express.Response<ResultsCount<Pokemon> | ApiError>
  ) => {
    const { ids = '' } = req.query;

    if(!ids) {
      const { limit = 20, offset = 0, name = '', types = '', id_limit = 1025 } = req.query;
      const query = gql`
        query ($limit: Int, $offset: Int, $name: String, $types: String) {
          pokemons(limit: $limit, offset: $offset, name: $name, types: $types) {
            id
            name
            types {
                type {
                  name
                  url
              }
            }
            stats {
                base_stat
                stat {
                    name
                }
            }
          }
        }
      `;
  
      const queryParams = {
        limit: Number(limit),
        offset: Number(offset),
        name,
        types,
        id_limit
      };
  
      try {
        const data = await requestGraphQL<{ pokemons: Pokemon[] }>(query, queryParams);        
        res.json(formatResultsCount(data.pokemons));
      } catch (err) {
        res.status(500).json({ error: 'GraphQL error', err });
      }
    } else {
      const query = gql`
        query ($ids: [ID]) {
          pokemonsByIds(ids: $ids) {
            id
            name
            types {
                type {
                  name
                  url
              }
            }
            stats {
                base_stat
                stat {
                    name
                }
            }
            forms {
              name
              url
            }
          }
        }
      `;
  
      // parsing to match graphql
      const queryParams = { ids: (ids as string).split(',') };
  
      try {
        const data = await requestGraphQL<{ pokemonsByIds: Pokemon[] }>(query, queryParams);
        const response = {
          count: data.pokemonsByIds.length,
          results: data.pokemonsByIds
        };
        
        res.json(response);
      } catch (err) {
        res.status(500).json({ error: 'GraphQL error', err });
      }
    }
  });

  return app;
}