import express from 'express';
import { request, gql } from 'graphql-request';

type Data = Record<string, Record<string, unknown>>;

export function evolutionChainRoutes(app: express.Express, graphqlUrl: string) {
  app.get('/api/evolution-chain/:id', async (
    req: express.Request<{ id: string }>,
    res: express.Response<Record<string, unknown>>
  ) => {
    const { id } = req.params;
    const queryParams = { id: Number(id) }

    const query = gql`
      query ($id: Int) {
        evolutionChain(id: $id) {
          id
          baby_trigger_item {
            name
            url
          }
          chain {
            is_baby
            species {
              name
              url
            }
            evolution_details {
              item { name url }
              trigger { name url }
              gender
              held_item { name url }
              move { name url }
              known_move_type { name url }
              location { name url }
              min_level
              min_happiness
              min_beauty
              min_affection
              needs_overworld_rain
              party_species { name url }
              party_type { name url }
              relative_physical_stats
              time_of_day
              trade_species { name url }
              turn_upside_down
            }
            evolves_to {
              is_baby
              species { name url }
              evolution_details {
                item { name url }
                trigger { name url }
                gender
                held_item { name url }
                move { name url }
                known_move_type { name url }
                location { name url }
                min_level
                min_happiness
                min_beauty
                min_affection
                needs_overworld_rain
                party_species { name url }
                party_type { name url }
                relative_physical_stats
                time_of_day
                trade_species { name url }
                turn_upside_down
              }
              evolves_to {
                is_baby
                species { name url }
                evolution_details {
                  item { name url }
                  trigger { name url }
                  gender
                  held_item { name url }
                  move { name url }
                  known_move_type { name url }
                  location { name url }
                  min_level
                  min_happiness
                  min_beauty
                  min_affection
                  needs_overworld_rain
                  party_species { name url }
                  party_type { name url }
                  relative_physical_stats
                  time_of_day
                  trade_species { name url }
                  turn_upside_down
                }
              }
            }
          }
        }
      }`;

    try {
      const data: Data = await request(graphqlUrl, query, queryParams);
      res.json(data.evolutionChain);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  return app;
}