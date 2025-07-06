import express from 'express';
import { pokeapiRoutes } from './routes/poke-api-router.ts';
import { userRoutes } from './routes/user.ts';
import { userSettingsRoutes } from './routes/user-settings-router.ts';
import { pokemonRoutes } from './routes/poke-api/pokemon-router.ts';
import { pokemonSpeciesRoutes } from './routes/poke-api/pokemon-species-router.ts';
import { pokemonTypeRoutes } from './routes/poke-api/pokemon-type-router.ts';


export const setRoutes = (
  app: express.Express,
  resources: Record<string, string>,
  host: string
) => {
  pokeapiRoutes(app, resources, host);
  pokemonRoutes(app);
  pokemonSpeciesRoutes(app);
  pokemonTypeRoutes(app);
  userRoutes(app);
  userSettingsRoutes(app);
  return app;
};
