const mongoose = require('mongoose');

const pokemonTypeSchema = new mongoose.Schema({
  id: Number,
  name: String
}, { collection: 'type' });

module.exports = mongoose.model('PokemonType', pokemonTypeSchema);