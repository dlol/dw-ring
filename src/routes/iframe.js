const router = require('express').Router()
const fs = require('fs')
const yaml = require('js-yaml')
const getPrettyDate = require('../lib/getPrettyDate')


const config = yaml.load(fs.readFileSync('config.yml', 'utf8'))
const title = config.title
const websites = config.websites
const desc = config.desc

router.get('/iframe', async (req, res) => {
    let website = req.query.website

    console.log(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.ip}]: /iframe ${req.headers.referer ? '(Ref: ' + req.headers.referer + ')' : ''}`)

    res.render('iframe', {
        title,
        desc,
        websites,
        website
    })
})

module.exports = router
