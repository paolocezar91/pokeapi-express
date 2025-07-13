import express from 'express';
import { request, gql } from 'graphql-request';

type Data = Record<string, Record<string, unknown>>;

export function movesRoutes(app: express.Express) {
  app.get('/api/moves/:id', async (
    req: express.Request<{ id: string }>,
    res: express.Response<Record<string, unknown>>
  ) => {
    const { id } = req.params;
    const name = isNaN(Number(id)) ? id : '';
    const params = { name, id: isNaN(Number(id)) ? undefined : Number(id) }
    const query = gql`
      query ($id: Int, $name: String) {
        move(id: $id, name: $name) {
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
      const data: Data = await request('http://localhost:5678/', query, params);
      // data.pokemonType = { ...data.pokemonType, pokemon: data.pokemonType.pokemon.map(p => p.pokemon) }
      res.json(data.move);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  app.get('/api/moves', async (
    _,
    res: express.Response<Record<string, unknown>>
  ) => {
    const query = gql`
      query {
        moves {
          id
          name
        }
      }
    `;

    try {
      const data: Data = await request('http://localhost:5678/', query, {});
      res.json(data.moves);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  app.get('/api/pokemon-many', async (
    req: express.Request,
    res: express.Response<Record<string, unknown>>
  ) => {
    const { ids = '' } = req.query;

    const query = gql`
      query ($ids: [ID]) {
        movesMany(ids: $ids) {
          id
          name
          power
          pp
          damage_class {
            name
          }
        }
      }
    `;

    // parsing to match graphql
    const vars = { ids: (ids as string).split(',') };

    try {
      const data: Data = await request('http://localhost:5678/', query, vars);
      res.json(data.movesMany);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error' });
    }
  });

  return app;
}