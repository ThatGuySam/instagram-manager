const getClient = require('./getClient')

module.exports =  async function (username, records = 25 ) {
    const client = await getClient()

    return await client.getPhotosByUsername({ username, first: records })
        .then(data => {
            const edges = data.user.edge_owner_to_timeline_media.edges
            return edges
        })
        .catch(console.log)
}