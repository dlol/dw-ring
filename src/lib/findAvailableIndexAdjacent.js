const websiteCheck = require('./websiteCheck')

async function findAvailableIndexAdjacent(index, websites, action) {
    // if prev and index - 1 < 0 it reached the start, get the length of the list - 1 to reach the last
    // if next and index + 1 >= length of list it reached the end so set it to 0 and if not just add 1
    let adjIndex = action === 'prev' ? (index - 1 < 0 ? websites.length - 1 : index - 1) : (index + 1 >= websites.length ? 0 : index + 1)

    while (true) {
        if ((await websiteCheck(websites[adjIndex].url, websites[adjIndex].slug)).configured || adjIndex === index) {
            break
        }

        // exact same thing here but replace index variable with adjIndex
        adjIndex = action === 'prev' ? (adjIndex - 1 < 0 ? websites.length - 1 : adjIndex - 1) : (adjIndex + 1 >= websites.length ? 0 : adjIndex + 1)
    } 
    return adjIndex
}

module.exports = findAvailableIndexAdjacent
