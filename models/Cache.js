class Cache{
    constructor(){
        this.pages = {}
    }
    // insert new page object into cache
    addPage(page){
        this.pages.push(page)
    }
    // remove page from cache object via key
    removePage(pageKey){
        delete this.pages[pageKey]
    }
}



module.exports =  Cache