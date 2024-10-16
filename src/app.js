const express = require('express')
const path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')


const getPrettyDate = require('./lib/getPrettyDate')
const downloadAssetAll = require('./lib/downloadAssetAll')
const makeThumbnailAll = require('./lib/makeThumbnailAll')

const config = yaml.load(fs.readFileSync(process.argv.includes('--docker') ? 'config/config.yml' : 'config.yml', 'utf8'))
const port = config.port
const websites = config.websites

const app = express()
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use('/', express.static(path.join(__dirname, 'static')))
app.set('trust proxy', true)

// routes loader
const routesDir = path.join(__dirname, 'routes')
const routes = express.Router()
fs.readdirSync(routesDir).forEach(file => {
    if (file !== '404.js') {
        let route = require(path.join(routesDir, file))
        routes.use(route)
    }
})

// load 404 route last or else it will override other routes
routes.use(require('./routes/404'))
app.use('/', routes)

app.listen(port, () => {
    console.log(`${getPrettyDate(new Date())}: Web Server is available at http://localhost:${port}.`)
})

// make thumbnails and download buttons and favicons for websites with --gen or if the gen folder doesn't exist
if (process.argv.includes('--gen') || process.argv.includes('--overwrite') || !fs.existsSync(path.join('src/static/gen/'))) {

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
} else {
    console.log(`${getPrettyDate(new Date())}: 'src/static/gen' exists or '--gen' was not passed.`)
}

// check if there's a minimum of 1 website on the webring, else die
if (websites.length < 1) {
    throw new Error(`${getPrettyDate(new Date())}: There are to few websites in the Webring! (bare minimum: 1)`)
}
