const mongoose = require('mongoose');

const abilitiesSchema = new mongoose.Schema({
  id: Number,
  name: String,
  effect_entries: [{
    effect : String,
    short_effect: String,
    language: {
        name: String
    }
}]
}, { collection: 'abilities' });

module.exports = mongoose.model('Abilities', abilitiesSchema);