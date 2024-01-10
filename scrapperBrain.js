const pokemonScrapper = require('./pokemonScraper')

// console.log(process.argv[2])

const URL = process.argv[2] || 'https://pokemondb.net/pokedex/pidgey'
const LIMIT = Number(process.argv[3]) || 1


 
async function fetchData(URL,LIMIT , isMega , currentMega)
{
  if(LIMIT > 0)
  {
    const [pokemon,next, mega ]  =  await pokemonScrapper.getPokemon(URL,isMega,currentMega)
    console.log(`Data fetched for ${pokemon.name}`)

    // console.log(pokemon)
    // console.log(next)
    // console.log(mega)

    if( !isMega && mega && mega.length > 1 && pokemon.name !== 'Pikachu' && pokemon.name !== 'Eevee' )
    {
      console.log("in the mega loop")
      let megaPos = 1
      while(megaPos < mega.length)
      {
        await fetchData(URL,1,true,megaPos)
        megaPos=megaPos+1
      }
    }

    await fetchData(next , LIMIT - 1 , false , 0)
  }
}

fetchData(URL,LIMIT , false, 0)