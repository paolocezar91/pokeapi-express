import express from 'express';
import { request, gql } from 'graphql-request';

type Data = Record<string, Record<string, unknown>>;

const parseSettings = (userId: string, data: Record<string, unknown>) => {
  return {
    userId,
    artworkUrl: data.artworkUrl,
    descriptionLang: data.descriptionLang,
    listTable: data.listTable,
    showColumn: (data.showColumn as boolean[])?.reduce((str, bool) => str + (bool ? 'y' : 'n'), ''),
    showShowColumn: data.showShowColumn,
    showThumbTable: data.showThumbTable,
    thumbLabelList: data.thumbLabelList,
    thumbSizeList: data.thumbSizeList,
    typeArtworkUrl: data.typeArtworkUrl,
    filter: data.filter
  };
};

const serializeSettings = (data: Record<string, unknown>) => {
  const showColumn = Array.from(data.showColumn as string).map(v => v === 'y' ? true : false)
  return {...data, showColumn };
};


export function userSettingsRoutes(app: express.Express) {
  app.get('/api/user/:user_id/settings', async (
    req: express.Request<{ user_id: string }>,
    res: express.Response<Record<string, unknown>>
  ) => {
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
          filter {
            name
            types
          }
        }
      }
    `;

    try {
      const data: Data = await request('http://localhost:5678/', query, { user_id });
      if(data.userSettings) {
        res.json(serializeSettings(data.userSettings))
      } else {
        res.json(null)
      }
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error' });
    }
  });

  app.post('/api/user/:user_id/settings', async (
    req: express.Request<{ user_id: string }, {}, Record<string, unknown>>,
    res: express.Response<Record<string, unknown>>
  ) => {
    const { user_id } = req.params;
    const input = parseSettings(user_id, req.body);
    const mutation = gql`
      mutation upsertUserSettings($input: UserSettingsInput!) {
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
          filter {
            name
            types
          }
        }
      }
    `;
    console.log({input})
    try {
      const data: Data = await request('http://localhost:5678/', mutation, { input });
        console.log({data})
        res.json(serializeSettings(data.upsertUserSettings))
    } catch (err) {
      res.status(500).json({ error: 'GraphQL error', err });
    }
  });

  return app;
}