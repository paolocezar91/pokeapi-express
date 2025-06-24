import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { PaginatedResponse } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getIdFromUrlSubstring(url = '') {
  return url.split("/")[url.split("/").length - 2];
}

function isNumeric(str: string) {
  if (typeof str != "string") return false;
  return !isNaN(str as unknown as number) && !isNaN(parseFloat(str));
}

export function pokeapiRoutes(app: express.Express, resources: Record<string, string>, host: string) {
  const dataDir = path.join(__dirname, '../../data/api/v2');
  const cors = (res: express.Response) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  };

  // Poke API abstraction
  app.get('/api/v2', (_, res: express.Response<PaginatedResponse>) => {
    res.json({
      count: Object.keys(resources).length,
      results: Object.keys(resources).map(resource => ({
        name: resource,
        url: `${host}/api/v2/${resource}/`
      }))
    });
  });

  app.get('/api/v2/:resource/', (
    req: express.Request<{ resource: string }, {}, {}, { offset: string, limit: string }>,
    res: express.Response<PaginatedResponse>
  ) => {
    cors(res);
    const { resource } = req.params;
    if (!resources[resource]) {
      res.status(404).json({
        error: 'Resource not found',
        count: 0,
        next: null,
        previous: null,
        results: []
      } as unknown as PaginatedResponse);
      return;
    }

    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    if (isNaN(limit) || isNaN(offset) || limit < 1 || offset < 0) {
      res.status(400).json({
        error: 'Invalid pagination parameters: limit must be positive integer, offset must be non-negative integer',
        count: 0,
        next: null,
        previous: null,
        results: []
      } as unknown as PaginatedResponse);
      return;
    }

    try {
      const indexFile = path.join(dataDir, resource, 'index.json');
      const indexData = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
      const allResults = indexData.results as { url: string, name: string }[];
      const totalCount = allResults.length;
      const paginatedResults = allResults.slice(offset, offset + limit);
      const nextOffset = offset + limit;
      const prevOffset = Math.max(offset - limit, 0);

      const response = {
        count: paginatedResults.length,
        total_count: totalCount,
        next: nextOffset < totalCount ?
          `${host}/api/v2/${resource}/?limit=${limit}&offset=${nextOffset}` :
          null,
        previous: offset > 0 ?
          `${host}/api/v2/${resource}/?limit=${limit}&offset=${prevOffset}` :
          null,
        results: paginatedResults.map(item => ({
          ...item,
          url: item.url.replace('/api/v2/', `${host}/api/v2/`)
        }))
      };

      res.json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: 'Error reading resource data',
        count: 0,
        next: null,
        previous: null,
        results: []
      } as unknown as PaginatedResponse);
    }
  });

  app.get('/api/v2/:resource/:id/', (
    req: express.Request<{ resource: string; id: string }>,
    res: express.Response<Record<string, unknown>>
  ) => {
    cors(res);

    const { resource, id } = req.params;
    if (!resources[resource]) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    let filePath;
    if (isNumeric(id)) {
      filePath = path.join(dataDir, resource, id, 'index.json');
    } else {
      const listPath = path.join(dataDir, resource, 'index.json');
      const list = JSON.parse(fs.readFileSync(listPath, 'utf8')) as PaginatedResponse;
      const idFromUrl = getIdFromUrlSubstring(list.results.find(resource => resource.name === id)?.url) || 'error';
      filePath = path.join(dataDir, resource, idFromUrl, 'index.json');
    }

    try {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      res.json(data);
    } catch (err) {
      res.status(404).json({ error: 'Resource item not found' });
    }
  });

  return app;
}