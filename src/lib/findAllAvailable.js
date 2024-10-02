const websiteCheck = require('./websiteCheck')

async function findAllAvailable(websites) {
    let result = []

    for (let i in websites) {
        if ((await websiteCheck(websites[i].url, websites[i].slug)).configured) {
            result.push(Number(i))
        }
    }
    return result
}

module.exports = findAllAvailable
