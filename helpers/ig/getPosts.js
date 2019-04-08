const getClient = require('./getClient')

module.exports =  async function (username) {
    const client = await getClient()

    return await client.getPhotosByUsername({ username })
}