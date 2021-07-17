export default class Page{
    // vals
    downloaded_page
    rendered_page
    url
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
}
