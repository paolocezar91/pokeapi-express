import express from 'express';
import { getResources } from './schema.ts';
import { setRoutes } from './router.ts';

const app = express();
app.use(express.json());

const PORT = 3030;

const resources = getResources();
setRoutes(app, resources, `http://localhost:${PORT}`);

app.listen(PORT, () => {
  console.log(`PokeAPI server running on http://localhost:${PORT}`);
});
