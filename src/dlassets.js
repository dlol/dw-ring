const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')

const getPrettyDate = require('./lib/getPrettyDate')
const downloadAssetAll = require('./lib/downloadAssetAll')
const makeThumbnailAll = require('./lib/makeThumbnailAll')

const config = yaml.load(fs.readFileSync(process.argv.includes('--docker') ? 'config/config.yml' : 'config.yml', 'utf8'))
const websites = config.websites



// docker exec dw-ring node src/dlassets.js <--gen> <--overwrite>

let overwrite = process.argv.includes('--overwrite')

if (process.argv.includes('--gen') && !overwrite)
    console.log(`${getPrettyDate(new Date())}: '--gen' passed, (re)generating assets.`)

if (overwrite)
    console.log(`${getPrettyDate(new Date())}: '--overwrite' passed, (re)generating and overwriting assets.`)

if (!fs.existsSync(path.join('src/static/gen/')) && !process.argv.includes('--gen'))
    console.log(`${getPrettyDate(new Date())}: 'src/static/gen/' folder doesn't exist, creating it and downloading assets, pass '--gen' to regenerate.`)

downloadAssetAll(websites.map(site => site.favicon ? { url: site.favicon, slug: site.slug } : null), 'favis',   overwrite)
downloadAssetAll(websites.map(site => site.button  ? { url: site.button, slug: site.slug  } : null), 'buttons', overwrite)
makeThumbnailAll(websites, overwrite)

let now = String(Date.now())
fs.writeFile('src/static/gen/date.log', now, err => {
    if (err) {
        console.error(`${getPrettyDate(new Date())}: Error writing last time generated to disk!\n`, err)
    } else {
        console.log(`${getPrettyDate(new Date())}: Wrote last time generated to disk!`, now)
    }
})

