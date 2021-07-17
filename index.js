const exp = require('express')
const axios = require('axios').default
const cheer = require('cheerio').default
const puppet = require('puppeteer')
const spoofURL = "https://www.google.com"
const log = console.log
const PORT = 8888
const app = exp()
let rendered_page = ''
let altered_page = ''

// start headless browser
async function grab_page(){
    log('Fetching')
    const browser = await puppet.launch()
    const page = await browser.newPage()
    await page.goto(spoofURL, {
        waitUntil: "networkidle2"
    })
    rendered_page = await page.content()
    log(rendered_page)
}
function alter_page(){
    log('Altering page')
//  parse to dom and alter paths
    let dom = cheer.load(rendered_page)
    // replace image paths
    dom('img').each((i, el)=>{
        let src = el.attribs.src
        let newSrc = spoofURL + src
        el.attribs['src'] = newSrc
    })
    // replace script sources
    dom('script').each((i, el)=>{
        if(el.attribs['src']){
            
            let oldSRC = el.attribs['src']
            let newSRC = spoofURL + oldSRC
            el.attribs['src'] = newSRC
        }
    })
    altered_page = dom.toString()
}

async function initiate(){
    await grab_page()
    alter_page()

}




// Entry
initiate()



// startup
app.listen(PORT, (err) => {
    if (err) log(err)
    log(`Server running on port ${PORT}`)
})

// grab page
// axios.get(spoofURL).then(data => cached = data.data).then(data => {
//     // parse to dom and alter paths
//     let dom = cheer.load(cached)
//     // replace image paths
//     dom('img').each((i, el)=>{
//         let src = el.attribs.src
//         let newSrc = spoofURL + src
//         el.attribs['src'] = newSrc
//         log (el.attribs['src'])
//     })
//     // replace script sources
//     dom('script').each((i, el)=>{
//         log(el.attribs)
//         if(el.attribs['src']){
            
//             let oldSRC = el.attribs['src']
//             let newSRC = spoofURL + oldSRC
//             el.attribs['src'] = newSRC
//         }
//     })
//     cached = dom.html()
    


// }).catch(err => log(err))





// Routing

app.get('/', (req, res) => {
    res.send(rendered_page)
})