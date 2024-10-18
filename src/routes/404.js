const router = require('express').Router()
const fs = require('fs')
const yaml = require('js-yaml')
const getPrettyDate = require('../lib/getPrettyDate')


const version = JSON.parse(fs.readFileSync('package.json')).version
const config = yaml.load(fs.readFileSync(process.argv.includes('--docker') ? 'config/config.yml' : 'config.yml', 'utf8'))
const title = config.title
const desc = config.desc
const permalink = config.permalink
const copyright = config.copyright
const startYear = config.startYear
const track = config.track
const staticPages = config.marked

router.use(async (req, res) => {
    console.log(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.ip}]: ${req.originalUrl} --> 404`)
    let startTime = Date.now()

    res.status(404).render('error', {
        title,
        errorTitle: '404 Not Found',
        error: `
            <p>You have probably lost yourself... This page does not exist.</p>
            <img style="width: 100%; max-width: 462px" src="/img/404.jpg" alt="404">
        `,
        desc,
        startTime,
        version,
        permalink,
        copyright,
        startYear,
        track,
        path: null,
        staticPages
    })
})

module.exports = router
