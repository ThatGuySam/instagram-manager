const getClient = require('./getClient')

module.exports =  async function (username) {
    const client = await getClient()

    return await client.getPhotosByUsername({ username })
        .then(data => {
            const edges = data.user.edge_owner_to_timeline_media.edges
            return edges
        })
        .catch(console.log)
}