const router = require('express').Router()
const fs = require('fs')
const yaml = require('js-yaml')
const marked = require('marked')

const websiteCheckAll = require('../lib/websiteCheckAll')
const getPrettyDate = require('../lib/getPrettyDate')


const version = JSON.parse(fs.readFileSync('package.json')).version
const config = yaml.load(fs.readFileSync(process.argv.includes('--docker') ? 'config/config.yml' : 'config.yml', 'utf8'))
const title = config.title
const websites = config.websites
const permalink = config.permalink
const copyright = config.copyright
const startYear = config.startYear
const desc = config.desc
const long = marked.parse(config.long)
const track = config.track

router.get('/', async (req, res) => {
    let websitesStatus = await websiteCheckAll(websites)
    let startTime = Date.now()
    const genDate = Number(fs.readFileSync('src/static/gen/date.log', { encoding: 'utf8' }))

    console.log(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.ip}]: /`)

    res.render('index', {
        title,
        desc,
        long,
        websites,
        genDate,
        permalink,
        copyright,
        startYear,
        websitesStatus,
        version,
        startTime,
        track,
        fs,
        getPrettyDate
    })
})

module.exports = router
