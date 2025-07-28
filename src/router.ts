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
const graphqlUrl = process.env.GRAPHQL_URL;

export const setRoutes = (
  app: express.Express,
  resources: Record<string, string>,
  host: string
) => {
  pokeapiRoutes(app, resources, host);
  pokemonRoutes(app, graphqlUrl);
  pokemonSpeciesRoutes(app, graphqlUrl);
  typesRoutes(app, graphqlUrl);
  movesRoutes(app, graphqlUrl);
  evolutionChainRoutes(app, graphqlUrl);
  userRoutes(app, graphqlUrl);
  userSettingsRoutes(app, graphqlUrl);
  abiltiesRoutes(app, graphqlUrl);
  return app;
};
