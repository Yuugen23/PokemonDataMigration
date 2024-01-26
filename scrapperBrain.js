
const pokemonScrapper = require('./Scrapper/pokemonScraper')
const moveScrapper = require('./Scrapper/moveScrapper')

const mongo = require('./Mongo/Mongo');
const mongoInsert = require('./Mongo/MongoInsert')

// console.log(process.argv[2])

/*
    pokemon :
      node scrapperBrain.js pokemon url limit
    moves :
      node scrapperBrain.js moves limit
*/ 

const TYPE = process.argv[2]
const URL = TYPE === 'pokemon' ? (process.argv[3] || 'https://pokemondb.net/pokedex/pidgey') : ''
const LIMIT = TYPE === 'pokemon' ? (Number(process.argv[4]) || 1) : (Number(process.argv[4]) || 1)


async function fetchPokemonData(URL, LIMIT, isMega, currentMega) {
  if (LIMIT > 0) {
    const [pokemon, next, mega] = await pokemonScrapper.getPokemon(URL, isMega, currentMega)
    console.log(`Data fetched for ${pokemon.name}`)
    try {
      await mongoInsert.pokeInsert(pokemon)
    } catch (e) { console.log("insertion failed", e.message); }

    if (!isMega && mega && mega.length > 1 && pokemon.name !== 'Pikachu' && pokemon.name !== 'Eevee') {
      console.log("in the mega loop")
      let megaPos = 1
      while (megaPos < mega.length) {
        await fetchPokemonData(URL, 1, true, megaPos)
        megaPos = megaPos + 1
      }
    }

    await fetchPokemonData(next, LIMIT - 1, false, 0)
  }
}

async function fetchMovesData(LIMIT) {
  const moveArray = await moveScrapper.getMoveURL(LIMIT)
  moveArray.foreach( async (move) => {
    const moveData = await moveScrapper.getMoveDetails(move)
    mongoInsert.moveInsert(moveData)
  })
  console.log(moveArray);
}

function start() {
  // await mongo.mongoConnect()
  if(TYPE === 'pokemon') {
    fetchPokemonData(URL, LIMIT, false, 0)
  } else {
    fetchMovesData(LIMIT)
  }
}
start()