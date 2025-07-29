import express from 'express';
import { getResources } from './schema.ts';
import { setRoutes } from './router.ts';
import cors from 'cors';
import morgan from  'morgan';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
if(process.env.ENV === 'local' || process.env.ENV === 'sandbox') {
  app.use(morgan('combined'));
}

const HOST = '0.0.0.0';
const PORT = 3030;
const URL = `http://${HOST}:${PORT}`

const resources = getResources();
setRoutes(app, resources, URL);

app.listen(PORT, HOST, () => {
  console.log(`PokeAPI server running on ${URL}`);
});
