import express from 'express';
import { gql } from 'graphql-request';
import { type ApiError, requestGraphQL } from '../utils.js';
import { type PokemonSpecies } from 'pokeapi-typescript';



export function pokemonSpeciesRoutes(app: express.Express) {
  app.get('/api/pokemon-species/:id', async (
    req: express.Request<{ id: string }>,
    res: express.Response<PokemonSpecies | ApiError>
  ) => {
    const { id } = req.params;
    const name = isNaN(Number(id)) ? id : '';
    const queryParams = { name, id: isNaN(Number(id)) ? undefined : Number(id) }

    const query = gql`
      query ($id: Int, $name: String) {
        pokemonSpecies(id: $id, name: $name) {
          base_happiness
          capture_rate
          color { name url }
          egg_groups { name url }
          evolution_chain { url }
          evolves_from_species { name url }
          flavor_text_entries {
            flavor_text
            language { name url }
            version { name url }
          }
          form_descriptions {
            description
            language { name url }
          }
          forms_switchable
          gender_rate
          genera { genus language { name url } }
          generation { name url }
          growth_rate { name url }
          habitat { name url }
          has_gender_differences
          hatch_counter
          id
          is_baby
          is_legendary
          is_mythical
          name
          names { language { name url } name }
          shape { name url }
          varieties {
            is_default
            pokemon { name url }
          }
        }
      }
    `;

    try {
      const data = await requestGraphQL<{pokemonSpecies: PokemonSpecies}>(query, queryParams);
      res.json(data.pokemonSpecies);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  return app;
}