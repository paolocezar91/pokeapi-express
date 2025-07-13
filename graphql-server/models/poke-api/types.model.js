const mongoose = require('mongoose');

const typesSchema = new mongoose.Schema({
  id: Number,
  name: String,
  pokemon: [{slot: Number, pokemon: { name: String, url: String }}],
  moves: [{ name: String, url: String }]
}, { collection: 'types' });

module.exports = mongoose.model('Types', typesSchema);