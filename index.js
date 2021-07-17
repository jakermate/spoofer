const exp = require('express')
const axios = require('axios').default
const cheer = require('cheerio').default
const puppet = require('puppeteer')
const fs = require('fs/promises')
const path = require('path')
let spoofURL = "https://www.google.com"
const log = console.log
const PORT = 8888
const app = exp()
let downloaded_page = ''
let rendered_page = ''
let page_object = {}

// check for args
let args = process.argv
if(args[2]){
    log(`Argument present - ${args[2]}`)
    // set optional arg to spoofURL
    spoofURL = args[2]
} 

// start headless browser
async function download_page(){
    log('Fetching')
    const browser = await puppet.launch()
    const page = await browser.newPage()
    page_object = page
    await page.goto(spoofURL, {
        waitUntil: "networkidle2"
    })
    downloaded_page = await page.content()
}
function render_page(){
    log('Rendering page')
//  parse to dom and alter paths
    let dom = cheer.load(downloaded_page)
    log(dom)
    // replace image paths
    dom('img').each((i, el)=>{
        let src = el.attribs.src
        let newSrc = spoofURL + src
        log(i + "  " + newSrc)
        el.attribs['src'] = newSrc
    })
 
    // set rendered page to active html string for main / route
    rendered_page = dom.html()
    createLog(rendered_page)
    log(`${spoofURL} spoof rendered.`)
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
    res.send(rendered_page)
})