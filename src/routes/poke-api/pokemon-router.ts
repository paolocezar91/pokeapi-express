import express from 'express';
import { request, gql } from 'graphql-request';

type Data = Record<string, Record<string, unknown>>;

export function pokemonRoutes(app: express.Express) {
  app.get('/api/pokemon/:id', async (
    req: express.Request<{ id: string }>,
    res: express.Response<Record<string, unknown>>
  ) => {
    const { id } = req.params;
    const name = isNaN(Number(id)) ? id : '';
    console.log({id, name});

    const query = gql`
      query ($id: ID, $name: String) { 
        pokemon(id: $id, name: $name) {
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
                front_shiny
                front_shiny_female
                back_default
                back_female
                back_shiny
                back_shiny_female
              }
              home {
                front_default
                front_female
                front_shiny
                front_shiny_female
                back_default
                back_female
                back_shiny
                back_shiny_female
              }
              official_artwork {
                front_default
                front_female
                front_shiny
                front_shiny_female
                back_default
                back_female
                back_shiny
                back_shiny_female
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

    try {
      const data: Data = await request('http://localhost:5678/', query, {name, id});
      console.log(data.pokemon)
      res.json(data.pokemon);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  app.get('/api/pokemon/', async (
    req: express.Request,
    res: express.Response<Record<string, unknown>>
  ) => {
    const { limit = 20, offset = 0 } = req.query;
    const query = gql`
      query ($limit: Int, $offset: Int) {
        pokemonList(limit: $limit, offset: $offset) {
          id
          name
          types {
              slot
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

    const vars = {
      limit: Number(limit),
      offset: Number(offset)
    };

    try {
      const data: Data = await request('http://localhost:5678/', query, vars);
      const paginatedResults = data.pokemonList;
      const response = {
        count: paginatedResults.length,
        results: paginatedResults
      };

      res.json(response);

    } catch (err) {
      res.status(500).json({ error: 'GraphQL error' });
    }
  });


  return app;
}