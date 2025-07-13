import express from 'express';
import { pokeapiRoutes } from './routes/poke-api-local.ts';
import { userRoutes } from './routes/user.ts';
import { userSettingsRoutes } from './routes/user-settings.ts';
import { pokemonRoutes } from './routes/poke-api-routes/pokemon.ts';
import { pokemonSpeciesRoutes } from './routes/poke-api-routes/pokemon-species.ts';
import { typesRoutes } from './routes/poke-api-routes/types.ts';
import { movesRoutes } from './routes/poke-api-routes/moves.ts';


export const setRoutes = (
  app: express.Express,
  resources: Record<string, string>,
  host: string
) => {
  pokeapiRoutes(app, resources, host);
  pokemonRoutes(app);
  pokemonSpeciesRoutes(app);
  typesRoutes(app);
  movesRoutes(app);
  userRoutes(app);
  userSettingsRoutes(app);
  return app;
};
