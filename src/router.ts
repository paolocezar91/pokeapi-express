import express from 'express';
import { pokeapiRoutes } from './routes/poke-api-local.ts';
import { userRoutes } from './routes/user-routes/user.ts';
import { userSettingsRoutes } from './routes/user-routes/settings.ts';
import { pokemonRoutes } from './routes/poke-api-routes/pokemon.ts';
import { pokemonSpeciesRoutes } from './routes/poke-api-routes/pokemon-species.ts';
import { typesRoutes } from './routes/poke-api-routes/types.ts';
import { movesRoutes } from './routes/poke-api-routes/moves.ts';
import { evolutionChainRoutes } from './routes/poke-api-routes/evolution-chain.ts';
import { abiltiesRoutes } from './routes/poke-api-routes/abilities.ts';


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
  evolutionChainRoutes(app);
  userRoutes(app);
  userSettingsRoutes(app);
  abiltiesRoutes(app)
  return app;
};
