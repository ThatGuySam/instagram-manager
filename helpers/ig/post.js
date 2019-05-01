const getClient = require('./getClient')

module.exports =  async function (photo, caption) {
    // Get the client
    const client = await getClient()
    // Get own profile

    let response

    try {
        response = await client.uploadPhoto({ photo, caption })
    } catch (error) {
        console.log('Error posting to Instagram', error)
        throw new Error(error)
    }
    
    return response
}