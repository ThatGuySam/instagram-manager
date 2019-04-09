const getClient = require('./getClient')

module.exports =  async function (photo, caption) {
    // Get the client
    const client = await getClient()
    // Get own profile
    const response = await client.uploadPhoto({ photo, caption })
    
    return response
}