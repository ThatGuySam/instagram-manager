const axios = require('axios')

module.exports =  async function () {
    let data = null
    
    await axios.get('https://www.reddit.com/user/stolenchristianmemes/upvoted.json')
        .then(res => data = res.data)
        .catch(console.log)
    
    return data.data.children
}