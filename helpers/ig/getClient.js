const Instagram = require('instagram-web-api')
const FileCookieStore = require('tough-cookie-filestore2')

let client = null

module.exports = async function () {
    
    if (client === null) {
        console.log('Creating new client')
        
        const username = process.env.USERNAME
        const password = process.env.PASSWORD
        const cookieStore = new FileCookieStore('./cookies/client.json')

        client = new Instagram({ username, password, cookieStore })

        await client.login()
    } else {
        console.log('Using existing client')
    }

    return client
}