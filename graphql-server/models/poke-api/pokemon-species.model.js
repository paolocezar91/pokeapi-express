const mongoose = require('mongoose');

const pokemonSpeciesSchema = new mongoose.Schema({
  base_happiness: Number,
  capture_rate: Number,
  color: {
    name: String,
    url: String
  },
  egg_groups: [
    {
      name: String,
      url: String
    }
  ],
  evolution_chain: {
    url: String
  },
  evolves_from_species: {
    name: String,
    url: String
  },
  flavor_text_entries: [
    {
      flavor_text: String,
      language: {
        name: String,
        url: String
      },
      version: {
        name: String,
        url: String
      }
    }
  ],
  form_descriptions: [mongoose.Schema.Types.Mixed],
  forms_switchable: Boolean,
  gender_rate: Number,
  genera: [
    {
      genus: String,
      language: {
        name: String,
        url: String
      }
    }
  ],
  generation: {
    name: String,
    url: String
  },
  growth_rate: {
    name: String,
    url: String
  },
  habitat: {
    name: String,
    url: String
  },
  has_gender_differences: Boolean,
  hatch_counter: Number,
  id: Number,
  is_baby: Boolean,
  is_legendary: Boolean,
  is_mythical: Boolean,
  name: String,
  names: [
    {
      language: {
        name: String,
        url: String
      },
      name: String
    }
  ],
  shape: {
    name: String,
    url: String
  },
  varieties: [
    {
      is_default: Boolean,
      pokemon: {
        name: String,
        url: String
      }
    }
  ]
}, { collection: 'pokemon-species' });

module.exports = mongoose.model('PokemonSpecies', pokemonSpeciesSchema);