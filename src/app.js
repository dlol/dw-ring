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

// make thumbnails and download buttons and favicons for websites if the gen folder doesn't exist
// regen with src/dlassets.js <--docker> <--overwrite>
if (!fs.existsSync(path.join('src/static/gen/'))) {

    if (!fs.existsSync(path.join('src/static/gen/')) && !process.argv.includes('--gen'))
        console.log(`${getPrettyDate(new Date())}: 'src/static/gen/' folder doesn't exist, creating and downloading assets`)
    
    downloadAssetAll(websites.map(site => site.favicon ? { url: site.favicon, slug: site.slug } : null), 'favis',   false)
    downloadAssetAll(websites.map(site => site.button  ? { url: site.button, slug: site.slug  } : null), 'buttons', false)
    makeThumbnailAll(websites, false)

    let now = String(Date.now())
    fs.writeFile('src/static/gen/date.log', now, err => {
        if (err) {
          console.error(`${getPrettyDate(new Date())}: Error writing last time generated to disk!\n`, err)
        } else {
            console.log(`${getPrettyDate(new Date())}: Wrote last time generated to disk!`, now)
        }
    })
} else {
    console.log(`${getPrettyDate(new Date())}: 'src/static/gen' exists skipping asset generation, use src/dlassets.js <--docker> <--overwrite> to (re)generate.`)
}

// check if there's a minimum of 1 website on the webring, else die
if (websites.length < 1) {
    throw new Error(`${getPrettyDate(new Date())}: There are too few websites in the Webring! (bare minimum: 1)`)
}
