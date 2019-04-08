const getClient = require('./getClient')

module.exports =  async function () {
    // Get the client
    const client = await getClient()
    // Get own profile
    const profile = await client.getProfile()
    
    return profile
}