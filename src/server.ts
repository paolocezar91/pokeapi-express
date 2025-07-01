import express from 'express';
import { getResources } from './schema.ts';
import { setRoutes } from './router.ts';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3030;
const HOST = 'localhost';

const resources = getResources();
setRoutes(app, resources, `http://${HOST}:${PORT}`);

app.listen(PORT, HOST, () => {
  console.log(`PokeAPI server running on http://localhost:${PORT}`);
});
