const mongoose = require('mongoose');
const Pokemon = require('./Schema/Pokemon.Mongo')

async function pokeInsert(pokemon) {
    console.log(pokemon);
    await Pokemon.create(pokemon)
}

module.exports = pokeInsert