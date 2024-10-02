const fs = require('fs')
const axios = require('axios')
const path = require('path')
const getPrettyDate = require('./getPrettyDate')


async function downloadAssetAll(sites, dir, overwrite) {
    let destinationDir = path.join(`src/static/gen/${dir}`)

    if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir, { recursive: true })
        console.log(`${getPrettyDate(new Date())}: Created directory:`, destinationDir)
    }

    for (let site of sites) {
        if (site) {
            let ext = site.url.split('.').pop()
            
            if (!fs.existsSync(path.join(destinationDir, `${site.slug}.${ext}`)) || overwrite) {
                try {
                    let response = await axios({
                        method: 'GET',
                        url: site.url,
                        responseType: 'stream'
                    })
            
                    let writer = fs.createWriteStream(destinationDir + '/' + `${site.slug}.${ext}`)
                
                    response.data.pipe(writer)
            
                    console.log(`${getPrettyDate(new Date())}: Downloaded asset:`, site.url)
            
                } catch (error) {
                    console.error(`${getPrettyDate(new Date())}: Error downloading asset for ${site.url}:\n`, error.message)
                }
            }
        }
    }
    console.log(`${getPrettyDate(new Date())}: Finished downloading assets for the directory:`, dir)
}

module.exports = downloadAssetAll
