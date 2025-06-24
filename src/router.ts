import express from 'express';
import { pokeapiRoutes } from './routes/pokeapi.ts';
import { userRoutes } from './routes/user.ts';


export const setRoutes = (
  app: express.Express,
  resources: Record<string, string>,
  host: string
) => {
  pokeapiRoutes(app, resources, host);
  userRoutes(app)
  return app;
};
