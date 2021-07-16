const PORT = 8888
const exp = require('express')
const app = exp()
const log = console.log
const axios = require('axios').default
const cheer = require('cheerio').default
let cached = ''
// startup
app.listen(PORT, (err) => {
    if (err) log(err)
    log(`Server running on port ${PORT}`)
})

app.get('/', (req, res) => {
    res.send(cached)
})

// grab page
axios.get('https://google.com').then(data => cached = data.data).then(data => {
    let dom = cheer.load(cached)
    // replace image paths
    dom('img').each((i, el)=>{
        let src = el.attribs.src
        let newSrc = 'https://www.google.com' + src
        el.attribs['src'] = newSrc
        log (el.attribs['src'])
    })
    // replace script sources
    dom('script').each((i, el)=>{
        log(el.attribs)
        if(el.attribs['src']){
            
            let oldSRC = el.attribs['src']
            let newSRC = "https://www.google.com" + oldSRC
            el.attribs['src'] = newSRC
        }
    })
    cached = dom.html()


}).catch(err => log(err))
