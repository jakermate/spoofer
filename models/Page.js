const puppet = require('puppeteer')
const cheer = require('cheerio').default
const fs = require('fs')
const {v4: uuid, v4} = require('uuid')

const path = require('path')
const logger_script = fs.readFileSync(path.join(__dirname,'../scripts', 'l.min.js'), 'utf-8')
class Page{
    // vals
    downloaded_page
    rendered_page
    url
    id
    set downloaded_page(html_string){
        this.downloaded_page = html_string
    }
    get downloaded_page(){
        return this.downloaded_page
    }
    set rendered_page(html_string){
        this.rendered_page = html_string
    }
    get rendered_page(){
        return this.rendered_page
    }
    //* CONTRUCTOR
    constructor(url){
        // Initiate download and render
        this.url = url
        this.id = uuid()
        this.downloaded_page = this.downloadPage
        this.rendered_page = this.renderSpoof
    }
    async downloadPage(url){
        log('Fetching ' + url)
        const browser = await puppet.launch() // launch browser
        const page = await browser.newPage() // open page
        await page.goto(url, {
            waitUntil: "networkidle2"
        })
        this.downloaded_page = await page.content() // download content
        await page.close() // closes tab
        await browser.close() // close browser
    }
    renderSpoof(url){
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
        this.rendered_page = dom.html()
        createLog(rendered_page)
        log(`${spoofURL} spoof rendered.`)
    }
    
}
module.exports = Page