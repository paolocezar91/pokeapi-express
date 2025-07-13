const mongoose = require('mongoose');

const movesSchema = new mongoose.Schema({
  id: Number,
  name: String,
  power: Number,
  accuracy: Number,
  pp: Number,
  learned_by_pokemon: [{
    name: String,
    url: String
  }],
  target: {
    name: String,
    url: String
  },
  flavor_text_entries: [{
      flavor_text: String,
      language: { name: String },
      version_group: { name: String }
  }],
  type: {
    name: String,
    url: String
  },
  damage_class: {
    name: String
  },
  effect_entries: [{
    language: { name: String },
    effect: String
  }]
}, { collection: 'moves' });

module.exports = mongoose.model('Moves', movesSchema);
