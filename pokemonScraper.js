const puppeteer = require('puppeteer');


async function getPokemon(URL,isMega, currentMega) 
{
  const browser = await puppeteer.launch({ headless: 'new' }) 
  const page = await browser.newPage()

  // console.log(`Browser created for ${URL}`)

  try 
  {
     
    await page.goto(URL, { timeout: 60000 });

    await page.waitForSelector('td', { timeout: 60000 }) 
    await page.waitForSelector('.cell-num', { timeout: 60000 }) 
    await page.waitForSelector('a' , {timeout:60000})
    await page.waitForSelector('img' , {timeout:60000})
    await page.waitForSelector('.sv-tabs-tab' , {timeout:60000})
    
   

    const [pokemon, next , mega , jump  ] = await page.evaluate((isMega,currentMega) => {

        const tabsEle = Array.from(document.querySelectorAll('.sv-tabs-tab'))
        const imageEle = Array.from(document.querySelectorAll('img'))
        const td = Array.from(document.querySelectorAll('td'))  
        const cellNum = Array.from(document.querySelectorAll('.cell-num'))   

        let j = 58
        if(isMega)
        {
          let a = []
          td.forEach( (ele , idx)=>{
            if(ele.firstChild && ele.innerText === td[0].innerText )
            {
              a.push(idx)
            }
          } )
          j= a[1]-a[0]
        }

        const jump =j


        if(isMega)  console.log(0 + (isMega ? currentMega * 0.1 : 0))

        const dexNo = Number(td[0].firstChild.innerHTML) + (isMega ? currentMega * 0.1 : 0)  
        
        const name = tabsEle[0 + (isMega ? currentMega : 0) ].innerText


        const image = imageEle[ 1 + (isMega ? currentMega : 0 ) ].src

        const type = []
        const typeEle = Array.from(td[1 + (isMega ? currentMega * jump : 0) ].childNodes)
        typeEle.forEach( t => {
            if(t.innerHTML) type.push(t.innerHTML)
        })

        const species = td[2].innerHTML
        const height = td[3 + (isMega ? currentMega * jump : 0)].innerText
        const weight = td[4 + (isMega ? currentMega * jump : 0)].innerText


        const evYield = td[7 + (isMega?currentMega*jump : 0 )].innerText
        const catchRate = td[8 + (isMega?currentMega*jump : 0 )].innerText
        const baseFriendShip = td[9 + (isMega?currentMega*jump : 0 )].innerText
        const baseExp = td[10 + (isMega?currentMega*jump : 0 )].innerText
        const growthRate = td[11 + (isMega?currentMega*jump : 0 )].innerText

        const eggGroup = td[12 + (isMega ? currentMega* jump : 0)].innerText
        const gender = td[13 + (isMega ? currentMega* jump : 0)].innerText
        const eggCycles = td[14 + (isMega ? currentMega*jump : 0) ].innerText


        const abilities =[]
        const abilitiesEle = td[5 + (isMega ? currentMega * jump : 0)].childNodes
  
        if(abilitiesEle[0].lastChild) abilities.push(abilitiesEle[0].lastChild.innerText);

        if (abilitiesEle.length > 2) {
          if (abilitiesEle[2].lastChild && abilitiesEle[2].lastChild.innerText) 
          {
            abilities.push(abilitiesEle[2].lastChild.innerText)
          }
          else 
          {
            if(abilitiesEle[2].firstChild)  abilities.push(abilitiesEle[2].firstChild.innerText)
          }
        }

        if (abilitiesEle.length > 4 && abilitiesEle[4].firstChild ) abilities.push(abilitiesEle[4].firstChild.innerText)

    
        const stats = []

        let pos = 0 + isMega ? 19 * currentMega : 0
        let i = 0
        while(i< 7 )
        {
          stats.push(Number(cellNum[pos].innerHTML))
          pos=pos+3
          i=i+1
        }
       
        const maxStats = []

        i=0
        pos = 2 + (isMega ? 19 * currentMega : 0)
        while(i<6)
        {
          maxStats.push(Number(cellNum[pos].innerHTML))
          pos=pos+3
          i=i+1
        }

        pokemon = new Object()
        pokemon.dexNo = dexNo
        pokemon.name = name
        pokemon.image=image
        pokemon.type = type
        pokemon.species = species
        pokemon.height = height
        pokemon.weight = weight
        pokemon.abilities = abilities
        
        const training = new Object()
        training.evYield = evYield
        training.catchRate = catchRate
        training.baseFriendShip = baseFriendShip
        training.baseExp = baseExp
        training.growthRate = growthRate
        
        const breeding = new Object()
        breeding.gender = gender
        breeding.eggGroup = eggGroup
        breeding.eggCycles = eggCycles 

        pokemon.training = training
        pokemon.breeding = breeding
        pokemon.stats=stats
        pokemon.maxStats = maxStats

        // ! pokemon type calculation goes here
        // pokemon.typeDefenses
    

        const mega = []

        tabsEle.forEach( tab =>{
          if(tab.href.includes('basic'))
          {
            mega.push(tab.href)
          }
        })

        const nextPokemon = Array.from(document.querySelectorAll('a'))[ dexNo===1 ? 58 : 59].href

        return [pokemon , nextPokemon,mega ,jump ]
    },isMega,currentMega )

    // console.log(pokemon)
    // console.log(jump)
    
    return [pokemon , next , mega]

  } 
  catch (error) {
    console.error(error)
  } finally {
    await browser.close()
  }

  
}

// getData('https://pokemondb.net/pokedex/raichu',true,1)
// getPokemon('https://pokemondb.net/pokedex/charmeleon',false,0)

// console.log(p)

module.exports = {getPokemon}