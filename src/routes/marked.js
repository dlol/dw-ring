const router = require('express').Router()
const fs = require('fs')
const yaml = require('js-yaml')
const marked = require('marked')

const getPrettyDate = require('../lib/getPrettyDate')


const version = JSON.parse(fs.readFileSync('package.json')).version
const config = yaml.load(fs.readFileSync(process.argv.includes('--docker') ? 'config/config.yml' : 'config.yml', 'utf8'))
const title = config.title
const permalink = config.permalink
const copyright = config.copyright
const startYear = config.startYear
const desc = config.desc
const track = config.track
const staticPages = config.marked


async function renderMarkdownPage (req, res, body) {
    let startTime = Date.now()

    console.log(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') || req.ip}]: ${req.url}`)

    let html = marked.parse(body)

    res.render('marked', {
        title,
        desc,
        html,
        startTime,
        version,
        permalink,
        copyright,
        startYear,
        track,
        path: req.url,
        staticPages
    })
}

for (const page of staticPages) {
    router.get(page.href, async (req, res) => renderMarkdownPage(req, res, page.body))
}

module.exports = router
