const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')
// const { index } = require('cheerio/lib/api/traversing')

const PORT = 3030

const app = express()

async function scrape(URL)
{
    await axios.get(URL)
    .then( res => {
        const data = cheerio.load(res.data)

        console.log(data('img'))

        // data('.attribute-value').each( (index,element) => {
        //     console.log("ok")
        //     console.log(`${index} --> ${data(element)}`)
        // } )
    } ).catch(e => console.log(e))
}

app.get( '/' , (req,res) => {
    res.send()
} )

async function startServer(PORT)
{
    await scrape('https://www.pokemon.com/us/pokedex/bulbasaur')
    app.listen(PORT)
}

startServer(PORT)
