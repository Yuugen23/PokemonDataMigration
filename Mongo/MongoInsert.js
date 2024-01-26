const mongoose = require('mongoose');
const Pokemon = require('./Schema/Pokemon.Mongo')
const Move = require('./Schema/Moves.Mongo')

async function pokeInsert(pokemon) {
    const filter = {
        name: pokemon.name
    }
    const update = pokemon

    await Pokemon.findOneAndUpdate(filter, update, {
        upsert: true
    })
}

async function moveInsert(move) {
    const filter = {
        name : move.name
    }
    const update = move

    await Move.findOneAndUpdate(filter, update, {
        upsert: true
    })
}

module.exports = {
    pokeInsert,
    moveInsert
}