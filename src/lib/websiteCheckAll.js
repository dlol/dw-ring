const websiteCheck = require('./websiteCheck')
const getPrettyDate = require('./getPrettyDate')


async function websiteCheckAll(websites) {
    let result = []

    for (let website of websites) {
        let status = await websiteCheck(website.url, website.slug)
        console.log(`${getPrettyDate(new Date())}: [${website.url}]: Alive: ${status.alive} | Configured: ${status.configured}${status.type ? ' | Type: ' + status.type : ''}`)
        result.push(status)
    }
    return result
}

module.exports = websiteCheckAll
