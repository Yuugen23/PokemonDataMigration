const mongoose = require('mongoose')

const PokeSchema = new mongoose.Schema({
    dexNo: Number,
    name: String,
    image: String,
    type: [String],
    species: [String],
    height: String,
    weight: String,
    abilities: [String],
    training: {
      evYield: String,
      catchRate: String,
      baseFriendShip: String,
      baseExp: String,
      growthRate: String
    },
    breeding: {
      gender: String,
      eggGroup: String,
      eggCycles: String
    },
    stats: [Number],
    maxStats: [Number]
  })

module.exports = mongoose.model('Pokemon', PokeSchema)