const puppeteer = require('puppeteer')

const MOVELISTURL = 'https://pokemondb.net/move/all'
  
async function getMoveURL(NUM)
{
    const browser = await puppeteer.launch({ headless: 'new' }) 
    const page = await browser.newPage()

    try
    {
        await page.goto(MOVELISTURL, { timeout: 60000 })
        await page.waitForSelector( 'tr' , { timeout: 60000 } )

        

        const moveArray = await page.evaluate( (NUM)=>{

            const moveLinks =[]
            const moveRows = Array.from(document.querySelectorAll('tr')).slice(1,NUM+1)

            moveRows.forEach((move , idx) =>{
                const newMove ={
                    id : idx-1, 
                    name: move.childNodes[1].innerText,
                    link: move.childNodes[1].firstChild.href  
                }     
                moveLinks.push(newMove)
            })

            return moveLinks
        },NUM  , extractEffects) 

        console.log(moveArray)
        return moveArray

    }
    catch(e){
        console.log(e)
    }
    finally
    {
        await browser.close()
    }
}


async function getMoveDetails(moveData)
{
    const browser = await puppeteer.launch({ headless: 'new' }) 
    const page = await browser.newPage()

    try
    {
        await page.goto(moveData.link, { timeout: 60000 })
        await page.waitForSelector( 'td' , { timeout: 60000 } )
        await page.waitForSelector( '.grid-col' , { timeout: 60000 } )
        await page.waitForSelector( '.mt-descr' , { timeout: 60000 } )

        

        const move = await page.evaluate( (moveData) =>{

            function extractPokemonNumber(inputString) {
                const match = inputString.match(/#(\d+)/);
            
                if (match && match[1]) {
                    return match[1];
                }
            
                return null; // Return null if the number is not found
            }
            
           
            
            
        
            

            function extractEffects(parentElement) {
                const effectText = parentElement.querySelector('h2#move-effects + p').textContent;
                const zMoveHeader = parentElement.querySelector('h3');
                const zMoveText = zMoveHeader ? getNextParagraphText(zMoveHeader) : '';
              
             
                return {
                  effect: effectText.trim(),
                  'Z-Move effects': zMoveText.trim()
                }
            }
              
            function getNextParagraphText(element) {
            const nextParagraph = element.nextElementSibling;
            return nextParagraph ? nextParagraph.textContent.trim() : '';
            }


            const td = Array.from(document.querySelectorAll('td'))
            const moveEffect = Array.from(document.querySelectorAll('.grid-col'))
            const moveTarget = Array.from(document.querySelectorAll('.mt-descr'))
            const learntByPokemons = Array.from(document.querySelectorAll('.infocard'))

            move = new Object()


            move.name = moveData.name
            
            move.effect = extractEffects(moveEffect[1])
            move.moveTarget = moveTarget[0].innerText

            move.type = td[0].innerText
            move.category = td[1].innerText.trimStart()
            move.basePower = td[2].innerText
            move.accuracy = td[3].innerText
            move.pp = td[4].innerText
            move.makeContact = td[5].innerText === 'Yes' ? true : false
            move.intro = td[6].innerText 
            
            move.learntBy = []
            if(learntByPokemons && learntByPokemons.length > 0 )
            {
                learntByPokemons.forEach( e=>{
                    move.learntBy.push(Number(extractPokemonNumber(e.innerText)))
                } )
            }

            return move
        },moveData ) 

        console.log(move)
        return move

    }
    catch(e){
        console.log(e)
    }
    finally
    {
        await browser.close()
    }
}

// getMoveURL(10)

const data =   {
    id: 1,
    name: '10,000,000 Volt Thunderbolt',
    link: 'https://pokemondb.net/move/10000000-volt-thunderbolt'
}

const data2 =   {
    id: 2,
    name: 'Acrobatics',
    link: 'https://pokemondb.net/move/acrobatics'
}


getMoveDetails(data)