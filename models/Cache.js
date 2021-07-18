class Cache{
    constructor(){
        this.pages = {}
    }
    // insert new page object into cache
    addPage(page){
        this.pages[page.id] = page //* Insert into cache object using UUID as key 
    }
    // remove page from cache object via key
    removePage(pageKey){
        delete this.pages[pageKey]
    }
}



module.exports =  Cache