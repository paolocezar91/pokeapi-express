const { gql } = require('apollo-server');

const userSettingsTypeDefs = gql`
  type UserSettings {
    id: ID!
    user: User
    artworkUrl: String
    descriptionLang: String
    listTable: Boolean
    showColumn: String
    showShowColumn: Boolean
    showThumbTable: Boolean
    thumbLabelList: String
    thumbSizeList: String
    typeArtworkUrl: String
  }

  input UserSettingsInput {
    userId: ID!
    artworkUrl: String
    descriptionLang: String
    listTable: Boolean
    showColumn: String
    showShowColumn: Boolean
    showThumbTable: Boolean
    thumbLabelList: String
    thumbSizeList: String
    typeArtworkUrl: String
  }

  type Query {
    userSettings(user_id: ID!): UserSettings
  }

  type Mutation {
    upsertUserSettings(input: UserSettingsInput!): UserSettings
  }
`;

const userSettingsResolvers = {
  Query: {
    userSettings: async (_, { user_id }, { pool }) => {
      const res = await pool.query('SELECT * FROM user_settings WHERE user_id = $1', [user_id]);
      const row = res.rows[0];
      if (!row) return null;
      return {
        id: row.id,
        user: { id: row.user_id },
        artworkUrl: row.artwork_url,
        descriptionLang: row.description_lang,
        listTable: row.list_table,
        showColumn: row.show_column,
        showShowColumn: row.show_show_column,
        showThumbTable: row.show_thumb_table,
        thumbLabelList: row.thumb_label_list,
        thumbSizeList: row.thumb_size_list,
        typeArtworkUrl: row.type_artwork_url
      };
    }
  },
  Mutation: {
    upsertUserSettings: async (_, { input }, { pool }) => {
      const {
        userId,
        artworkUrl,
        descriptionLang,
        listTable,
        showColumn,
        showShowColumn,
        showThumbTable,
        thumbLabelList,
        thumbSizeList,
        typeArtworkUrl
      } = input;

      // Map camelCase input to snake_case DB columns
      const fields = [
        { key: 'artwork_url', value: artworkUrl },
        { key: 'description_lang', value: descriptionLang },
        { key: 'list_table', value: listTable },
        { key: 'show_column', value: showColumn },
        { key: 'show_show_column', value: showShowColumn },
        { key: 'show_thumb_table', value: showThumbTable },
        { key: 'thumb_label_list', value: thumbLabelList },
        { key: 'thumb_size_list', value: thumbSizeList },
        { key: 'type_artwork_url', value: typeArtworkUrl }
      ];

      const columns = fields.filter(f => f.value !== undefined);

      const insertCols = ['user_id', ...columns.map(f => f.key)];
      const insertVals = [userId, ...columns.map(f => f.value)];
      const insertParams = insertVals.map((_, i) => `$${i + 1}`);

      const updateSet = columns.map(f => `${f.key} = EXCLUDED.${f.key}`).join(', ');

      const query = `
        INSERT INTO user_settings (${insertCols.join(', ')})
        VALUES (${insertParams.join(', ')})
        ON CONFLICT (user_id) DO UPDATE SET
          ${updateSet}
        RETURNING *;
      `;

      const res = await pool.query(query, insertVals);
      const row = res.rows[0];
      return {
        id: row.id,
        user: { id: row.user_id },
        artworkUrl: row.artwork_url,
        descriptionLang: row.description_lang,
        listTable: row.list_table,
        showColumn: row.show_column,
        showShowColumn: row.show_show_column,
        showThumbTable: row.show_thumb_table,
        thumbLabelList: row.thumb_label_list,
        thumbSizeList: row.thumb_size_list,
        typeArtworkUrl: row.type_artwork_url
      };
    }
  },
  UserSettings: {
    user: async (parent, _, { pool }) => {
      if (!parent.user || !parent.user.id) return null;
      const res = await pool.query('SELECT * FROM users WHERE id = $1', [parent.user.id]);
      return res.rows[0];
    }
  }
};

module.exports = { userSettingsTypeDefs, userSettingsResolvers };