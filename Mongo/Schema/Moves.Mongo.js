const mongoose = require('mongoose')

const moveSchema = new mongoose.Schema({
    name: String,
    effect: {
        effect: String,
        zMoveEffect: String
    },
    moveTarget: String,
    type: String,
    category: String,
    basePower: String,
    accuracy: String,
    pp: String,
    makeContact: Boolean,
    intro: String,
    learntBy: [Number]
})

module.exports = mongoose.model('Move', moveSchema)