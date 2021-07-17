const exp = require('express')
const axios = require('axios').default
const cheer = require('cheerio').default
const puppet = require('puppeteer')
const fs = require('fs/promises')
const path = require('path')
const spoofURL = "https://www.google.com"
const log = console.log
const PORT = 8888
const app = exp()
let downloaded_page = ''
let rendered_page = ''

// start headless browser
async function download_page(){
    log('Fetching')
    const browser = await puppet.launch()
    const page = await browser.newPage()
    await page.goto(spoofURL, {
        waitUntil: "networkidle2"
    })
    downloaded_page = await page.content()
}
function render_page(){
    log('Rendering page')
//  parse to dom and alter paths
    let dom = cheer.load(downloaded_page)
    // replace image paths
    dom('img').each((i, el)=>{
        let src = el.attribs.src
        let newSrc = spoofURL + src
        log(i + "  " + newSrc)
        el.attribs['src'] = newSrc
    })
    // replace script sources
    // dom('script').each((i, el)=>{
    //     if(el.attribs['src']){
            
    //         let oldSRC = el.attribs['src']
    //         let newSRC = spoofURL + oldSRC
    //         el.attribs['src'] = newSRC
    //     }
    // })
    // log(dom.toString())
    rendered_page = dom.toString()
    createLog(rendered_page)
}
// easy to view log of rendered input/output
async function createLog(string){
    let filename = "log.txt"
    await fs.writeFile(path.join(__dirname, "logs", filename), `rendered page - \n ${string}\ndownloaded page - \n ${downloaded_page}`)

}
async function initiate(){
    await download_page()
    render_page()

}




// Entry
initiate()











// startup
app.listen(PORT, (err) => {
    if (err) log(err)
    log(`Server running on port ${PORT}`)
})

// Routing

app.get('/', (req, res) => {
    res.send(rendered)
})