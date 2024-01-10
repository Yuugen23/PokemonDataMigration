
const pokemonScrapper = require('./Scrapper/pokemonScraper')
const mongo = require('./Mongo/Mongo');
const pokeInsert = require('./Mongo/MongoInsert')

// console.log(process.argv[2])

const URL = process.argv[2] || 'https://pokemondb.net/pokedex/pidgey'
const LIMIT = Number(process.argv[3]) || 1



async function fetchData(URL, LIMIT, isMega, currentMega) {
  if (LIMIT > 0) {
    const [pokemon, next, mega] = await pokemonScrapper.getPokemon(URL, isMega, currentMega)
    console.log(`Data fetched for ${pokemon.name}`)
    try {
      await pokeInsert(pokemon)
    } catch (e) { console.log("insertion failed", e.message); }
    // console.log(pokemon)
    // console.log(next)
    // console.log(mega)

    if (!isMega && mega && mega.length > 1 && pokemon.name !== 'Pikachu' && pokemon.name !== 'Eevee') {
      console.log("in the mega loop")
      let megaPos = 1
      while (megaPos < mega.length) {
        await fetchData(URL, 1, true, megaPos)
        megaPos = megaPos + 1
      }
    }

    await fetchData(next, LIMIT - 1, false, 0)
  }
}
async function start() {
  await mongo.mongoConnect()
  fetchData(URL, LIMIT, false, 0)
}
start()