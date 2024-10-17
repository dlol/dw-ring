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


async function renderMarkdownPage (req, res, fileName) {
    let startTime = Date.now()

    console.log(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') || req.ip}]: ${req.url}`)

    let html = marked.parse(fs.readFileSync(fileName, 'utf-8'))

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
    })
}

router.get('/about', async (req, res) => renderMarkdownPage(req, res, 'README.md'));
router.get('/help', async (req, res) => renderMarkdownPage(req, res, 'HELP.md'));
router.get('/join', async (req, res) => renderMarkdownPage(req, res, 'JOIN.md'));

module.exports = router
