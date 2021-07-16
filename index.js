const PORT = 8888
const exp = require('express')
const app = exp()
const log = console.log
const axios = require('axios').default
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
    // cached = decodeURI(cached)
    cached = cached.replace(/src="/g, 'src="https://google.com/')
    log(cached)
}).catch(err => log(err))
