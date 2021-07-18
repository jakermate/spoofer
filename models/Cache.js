class Cache{
    constructor(){
        this.pages = {}
    }
    // insert new page object into cache
    addPage(page){
        this.pages[page.url] = page //* Insert into cache object using URL as key 
        // TODO Change to be a unique key
    }
    // remove page from cache object via key
    removePage(pageKey){
        delete this.pages[pageKey]
    }
}



module.exports =  Cache