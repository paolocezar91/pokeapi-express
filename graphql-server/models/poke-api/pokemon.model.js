const mongoose = require('mongoose');

const pokemonSchema = new mongoose.Schema({
  id: Number,
  name: String,
  base_experience: Number,
  height: Number,
  weight: Number,
  is_default: Boolean,
  order: Number,
  location_area_encounters: String,
  abilities: [
    {
      ability: {
        name: String,
        url: String
      },
      is_hidden: Boolean,
      slot: Number
    }
  ],
  cries: {
    latest: String,
    legacy: String
  },
  forms: [
    {
      name: String,
      url: String
    }
  ],
  game_indices: [
    {
      game_index: Number,
      version: {
        name: String,
        url: String
      }
    }
  ],
  moves: [
    {
      move: {
        name: String,
        url: String
      },
      version_group_details: [
        {
          level_learned_at: Number,
          move_learn_method: {
            name: String,
            url: String
          },
          order: Number,
          version_group: {
            name: String,
            url: String
          }
        }
      ]
    }
  ],
  past_abilities: [
    {
      abilities: [
        {
          ability: mongoose.Schema.Types.Mixed,
          is_hidden: Boolean,
          slot: Number
        }
      ],
      generation: {
        name: String,
        url: String
      }
    }
  ],
  past_types: [mongoose.Schema.Types.Mixed],
  species: {
    name: String,
    url: String
  },
  sprites: mongoose.Schema.Types.Mixed,
  stats: [
    {
      base_stat: Number,
      effort: Number,
      stat: {
        name: String,
        url: String
      }
    }
  ],
  types: [
    {
      slot: Number,
      type: {
        name: String,
        url: String
      }
    }
  ]
}, { collection: 'pokemon' });

module.exports = mongoose.model('Pokemon', pokemonSchema);