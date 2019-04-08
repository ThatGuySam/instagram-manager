const axios = require('axios')

module.exports =  async function () {
    let data = null
    
    await axios.get('https://www.reddit.com/r/dankchristianmemes/new.json')
        .then(res => data = res.data)
        .catch(console.log)
    
    return data.data
}