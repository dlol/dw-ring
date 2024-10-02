const websiteCheck = require('./websiteCheck')

async function findAvailableIndexExtreme(websites, action) {
    // here its trying to find extremity so set it to 0 if first or length of list - 1 to get the extremity in the other end*
    let xtrIndex = action === 'first' ? 0 : websites.length - 1

    while (true) {
        if ((await websiteCheck(websites[xtrIndex].url, websites[xtrIndex].slug)).configured) {
            // break out of the loop the moment it finds something
            break
        
        } else if (    
            // if extremityIndex is the number of items in the websites array AND action is first
            ((xtrIndex === websites.length - 1) && (action === 'first')) || // OR
            
            // if extremityIndex is 0 (so it reached the beginning from 'last') AND action is last
            ((xtrIndex === 0) && (action === 'last'))
        ) {
            // return as a -1 to be processes as a failure to find any website working
            xtrIndex = -1
            break
        }

        // *no need to replace anything like findAvailableIndexAdjacent because it already knows, it's the extremities
        xtrIndex = action === 'first' ? xtrIndex + 1 : xtrIndex - 1
    }
    return xtrIndex
}

module.exports = findAvailableIndexExtreme
