import express from 'express';
import { pokeapiRoutes } from './routes/poke-api-local.js';
import { userRoutes } from './routes/user-routes/user.js';
import { userSettingsRoutes } from './routes/user-routes/settings.js';
import { pokemonRoutes } from './routes/poke-api-routes/pokemon.js';
import { pokemonSpeciesRoutes } from './routes/poke-api-routes/pokemon-species.js';
import { typesRoutes } from './routes/poke-api-routes/types.js';
import { movesRoutes } from './routes/poke-api-routes/moves.js';
import { evolutionChainRoutes } from './routes/poke-api-routes/evolution-chain.js';
import { abiltiesRoutes } from './routes/poke-api-routes/abilities.js';
import { machinesRoutes } from './routes/poke-api-routes/machines.js';
import { moveTargetRoutes } from './routes/poke-api-routes/move-target.js';
import { pokemonFormRoutes } from './routes/poke-api-routes/pokemon-form.js';

export const setRoutes = (
  app: express.Express,
  resources: Record<string, string>,
  host: string
) => {
  // pokeapiRoutes(app, resources, host);
  pokemonRoutes(app);
  pokemonSpeciesRoutes(app);
  typesRoutes(app);
  movesRoutes(app);
  evolutionChainRoutes(app);
  userRoutes(app);
  userSettingsRoutes(app);
  abiltiesRoutes(app);
  machinesRoutes(app);
  moveTargetRoutes(app);
  pokemonFormRoutes(app);
  return app;
};
