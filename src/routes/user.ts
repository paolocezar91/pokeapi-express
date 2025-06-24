import express from 'express';
import { request, gql } from 'graphql-request';

type Data = Record<string, Record<string, unknown>>;

export function userRoutes(app: express.Express) {
  const cors = (res: express.Response) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  };

  app.get('/api/user/:github_id', async (
    req: express.Request<{ github_id: string }>,
    res: express.Response<Record<string, unknown>>
  ) => {
    cors(res);
    const { github_id } = req.params;
    const query = gql`
      query { 
        user(github_id: "${github_id}") {
          id,
          github_id
        }
      }
    `;

    try {
      const data: Data = await request('http://localhost:5678/', query, { github_id });
      res.json(data.user);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error' });
    }
  });

  app.get('/api/user/:user_id/settings', async (
    req: express.Request<{ user_id: string }>,
    res: express.Response<Record<string, unknown>>
  ) => {
    cors(res);
    const { user_id } = req.params;

    const query = gql`
      query ($user_id: ID!) {
        userSettings(user_id: $user_id) {
          id
          user { id }
          artworkUrl
          descriptionLang
          listTable
          showColumn
          showShowColumn
          showThumbTable
          thumbLabelList
          thumbSizeList
          typeArtworkUrl
        }
      }
    `;

    try {
      const data: Data = await request('http://localhost:5678/', query, { user_id });
      const showColumn = Array.from(data.userSettings.showColumn as string).map(v => v === 'y' ? true : false)
      res.json({...data.userSettings, showColumn });
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error' });
    }
  });

  app.post('/api/user/:user_id/settings', async (
    req: express.Request<{ user_id: string }, {}, Record<string, unknown>>,
    res: express.Response<Record<string, unknown>>
  ) => {
    cors(res);

    const { user_id } = req.params;
    // The body should contain the user settings fields (camelCase)
    const {
      artworkUrl,
      descriptionLang,
      listTable,
      showColumn,
      showShowColumn,
      showThumbTable,
      thumbLabelList,
      thumbSizeList,
      typeArtworkUrl
    } = req.body as Record<string, string | boolean>;

    const mutation = gql`
      mutation UpsertUserSettings($input: UserSettingsInput!) {
        upsertUserSettings(input: $input) {
          id
          user { id }
          artworkUrl
          descriptionLang
          listTable
          showColumn
          showShowColumn
          showThumbTable
          thumbLabelList
          thumbSizeList
          typeArtworkUrl
        }
      }
    `;

    const input = {
      userId: user_id,
      artworkUrl,
      descriptionLang,
      listTable,
      showColumn,
      showShowColumn,
      showThumbTable,
      thumbLabelList,
      thumbSizeList,
      typeArtworkUrl
    };

    try {
      const data: Data = await request('http://localhost:5678/', mutation, { input });
      res.json(data.upsertUserSettings);
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error' });
    }
  });

  return app;
}