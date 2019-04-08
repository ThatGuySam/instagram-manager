const Client = require('instagram-private-api').V1

let device = null

module.exports = function () {
    
    if (device === null) {
        console.log('Creating new device')
        device = new Client.Device(process.env.USERNAME)
    } else {
        console.log('Using existing device')
    }

    return device
}