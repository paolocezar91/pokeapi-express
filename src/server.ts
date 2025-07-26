import express from 'express';
import { getResources } from './schema.js';
import { setRoutes } from './router.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const HOST = '0.0.0.0';
const PORT = 3030;

const resources = getResources();
setRoutes(app, resources, `http://${HOST}:${PORT}`);

app.listen(PORT, HOST, () => {
  console.log(`PokeAPI server running on http://${HOST}:${PORT}`);
});
