const puppeteer = require('puppeteer');

async function getData(URL) {
  const browser = await puppeteer.launch({ headless: 'new' }); // launch a headful browser for debugging
  const page = await browser.newPage();

  console.log("Browser created");

  try {
    // Increase navigation timeout to 60 seconds
    await page.goto(URL, { timeout: 60000 });

    console.log("Went to the page");

    await page.waitForSelector('td', { timeout: 60000 }) //
    await page.waitForSelector('.cell-num', { timeout: 60000 }) //
    

    console.log("Page fully loaded");

    const pokemon = await page.evaluate(() => {
      
        console.log("Started scraping");

        const td = Array.from(document.querySelectorAll('td'));    
        const cellNum = Array.from(document.querySelectorAll('.cell-num'))   
        const dexNo = td[0].firstChild.innerHTML
        
        const type = []
        const typeEle = Array.from(td[1].childNodes)
        typeEle.forEach( t => {
            if(t.innerHTML) type.push(t.innerHTML)
        })

        const species = td[2].innerHTML
        const height = td[3].innerText
        const weight = td[4].innerText

        const abilities =[]

        const abilitiesEle = Array.from(td[5].childNodes)
        
        abilities.push(abilitiesEle[0].lastChild.innerText)
        if(abilitiesEle.length>2) 
        {
          if(abilitiesEle[2].lastChild.innerText) abilities.push(abilitiesEle[2].lastChild.innerText)
          else abilities.push(abilitiesEle[2].firstChild.innerText)
          
        }

        if(abilitiesEle.length>4) abilities.push(abilitiesEle[4].firstChild.innerText)
    
        const stats = []

        let pos = 0
        while(pos<20)
        {
          stats.push(cellNum[pos].innerHTML)
          pos=pos+3
        }

        const pokemon = new Object()
        pokemon.dexNo = dexNo
        pokemon.type = type
        // pokemon.species = species
        pokemon.height = height
        pokemon.weight = weight
        pokemon.abilities = abilities
        pokemon.stats=stats
    
        return pokemon
    });

    console.log(pokemon);

  } catch (error) {
    console.error('Error during navigation:', error.message);
  } finally {
    
  }
}

getData('https://pokemondb.net/pokedex/pidgey');
// getData('https://pokemondb.net/pokedex/beedrill');
