const Client = require('instagram-private-api').V1

const getDevice = require('./getDevice')

module.exports = async function (username) {

    const device = new Client.Device(process.env.USERNAME)//getDevice()
    console.log('device', device)
    const storage = new Client.CookieFileStorage(__dirname + '/../cookies/client-private.json')

    // And go for login
    const relationship = await Client.Session.create(device, storage, process.env.USERNAME, process.env.PASSWORD)
        .then(function(session) {
            // Now you have a session, we can follow / unfollow, anything...
            // And we want to follow Instagram official profile
            return [session, Client.Account.searchForUser(session, username)]   
        })
        // .spread(function(session, account) {
        //     console.log('Client', Client)
        //     return Client.Relationship.create(session, account.id);
        // })
        // .then(function(relationship) {
        //     console.log(relationship.params)
        //     // {followedBy: ... , following: ... }
        //     // Yey, you just followed @instagram
        // })

        console.log('relationship.params', relationship.params)

    return relationship
}