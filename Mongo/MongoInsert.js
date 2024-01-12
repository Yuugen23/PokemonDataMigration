const mongoose = require('mongoose');
const Pokemon = require('./Schema/Pokemon.Mongo')

async function pokeInsert(pokemon) {
    const filter = {
        name: pokemon.name
    }
    const update = pokemon

    await Pokemon.findOneAndUpdate(filter, update, {
        upsert: true
    })
}

module.exports = pokeInsert