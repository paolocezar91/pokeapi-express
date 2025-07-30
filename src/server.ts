import express from 'express';
import { getResources } from './schema.js';
import { setRoutes } from './router.js';
import cors from 'cors';
import morgan from  'morgan';
import dotenv from 'dotenv';
dotenv.config({ path: ".env" });

const app = express();
app.use(express.json());
app.use(cors());

function run(HOST, PORT, URL, ENVIRONMENT) {
  if(ENVIRONMENT === 'local' || ENVIRONMENT === 'test') {
    app.use(morgan('combined'));
  }
  
  // const resources = getResources();
  setRoutes(app, {}, URL);
  
  app.listen(PORT, HOST, () => {
    console.log(`PokeAPI server running on ${URL} in ${ENVIRONMENT}`);
  });
}

const HOST = process.env.HOST;
const PORT = process.env.PORT;
const URL = `http://${HOST}:${PORT}`;
const ENVIRONMENT = process.env.ENVIRONMENT;

run(HOST, PORT, URL, ENVIRONMENT);