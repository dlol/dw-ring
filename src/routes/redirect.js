const router = require('express').Router()
const fs = require('fs')
const yaml = require('js-yaml')


const version = JSON.parse(fs.readFileSync('package.json')).version
const config = yaml.load(fs.readFileSync(process.argv.includes('--docker') ? 'config/config.yml' : 'config.yml', 'utf8'))
const title = config.title
const websites = config.websites
const desc = config.desc
const permalink = config.permalink
const copyright = config.copyright
const startYear = config.startYear
const track = config.track
const staticPages = config.marked

const findAvailableIndexAdjacent = require('../lib/findAvailableIndexAdjacent')
const findAvailableIndexExtreme = require('../lib/findAvailableIndexExtreme')
const findAllAvailable = require('../lib/findAllAvailable')
const getPrettyDate = require('../lib/getPrettyDate')


const startTime = Date.now()

router.get('/redirect', async (req, res) => {
    let website = req.query.website
    let action = req.query.action
    let index = websites.findIndex(site => site.slug === website)

    // if the action is random and there is no website param, it will just select a random working site
    // good for putting this on the index site or another site that isn't part of the ring itself
    if (action === 'random' && !website) {
        let availableWebsites = await findAllAvailable(websites)

        if (availableWebsites.length > 0) {
            let random = websites[availableWebsites[Math.floor(Math.random() * availableWebsites.length)]].url
            console.log(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.ip}]: randomNoCheck --> ${random}`)
            res.redirect(random)
        } else {
            console.error(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.ip}]: randomNoCheck --> sendBrickedWebring`)
            sendBrickedWebring(res)
        }
    
    // because website is set, we will remove its index to prevent random from redirecting it to itself
    } else if (action === 'random' && websites.some(site  => site.slug === website)) {

        let availableWebsites = await findAllAvailable(websites)

        let indexToRemove = availableWebsites.indexOf(index)
        if (indexToRemove !== -1) {
            availableWebsites.splice(indexToRemove, 1)
        }

        if (availableWebsites.length > 0) {
            let random = websites[availableWebsites[Math.floor(Math.random() * availableWebsites.length)]].url
            console.log(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.ip}]: randomWithCheck --> ${random}`)
            res.redirect(random)
        } else {
            console.error(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.ip}]: randomWithCheck --> sendBrickedWebring`)
            sendBrickedWebring(res)
        }

    // if the action is prev or next then it must have the website included and it must be part of the webring!
    } else if ((action === 'prev' || action === 'next') && websites.some(site  => site.slug === website)) {
        let adjIndex

        if (action === 'prev') {
            adjIndex = await findAvailableIndexAdjacent(index, websites, 'prev')
        } else if (action === 'next') {
            adjIndex = await findAvailableIndexAdjacent(index, websites, 'next')
        }

        // check if next/prev isn't the same as the current site, if it is send bricked webring
        if (adjIndex !== index) {
            let url = websites[adjIndex].url
            console.log(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.ip}]: prev/next --> ${url}`)
            res.redirect(url)
        } else {
            console.error(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.ip}]: prev/next --> sendBrickedWebring`)
            sendBrickedWebring(res)
        }

    // here we don't care if website is set or not, just ignore it, take the user to the last or first available
    // website, good to put on index like the random w/o checking if its the same website
    } else if (action === 'first' || action === 'last') {
        let xtrIndex

        if (action === 'first') {
            xtrIndex = await findAvailableIndexExtreme(websites, 'first')
        } else if (action === 'last') { 
            xtrIndex = await findAvailableIndexExtreme(websites, 'last')
        }

        // but we have to change this, ignoring if xtrIndex === index and only sending bricked webring if there's no xtrIndex at all
        if (xtrIndex !== -1) {
            let url = websites[xtrIndex].url
            console.log(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.ip}]: first/last --> ${url}`)
            res.redirect(url)
        } else {
            console.error(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.ip}]: first/last --> sendBrickedWebring`)
            sendBrickedWebring(res)
        }

    } else {
        console.error(`${getPrettyDate(new Date())}: [${req.header('CF-Connecting-IP') ? req.header('CF-Connecting-IP') : req.ip}]: Redirect Param Error`)
        res.status(400).render('error', {
            title,
            errorTitle: 'Redirect Param Error',
            startTime,
            version,
            permalink,
            copyright,
            startYear,
            track,
            error: `
                <h3>Possible reasons for this error:</h3>
                <ul class="error">
                    <li>The action param was "random" but the website param's value isn't in the Webring.</li>
                    <li>The action param was "prev" or "next" but the website param's value isn't in the Webring.</li>
                    <li>The action param wasn't "first", "last" or "random".</li>
                    <li>You're severely retarded and discovered a new way to fuck up.</li>
                </ul>
            `,
            desc,
            path: null,
            staticPages
        })
    }
})

async function sendBrickedWebring(res) {
    res.status(500).render('error', {
        title,
        errorTitle: 'Bricked Webring Error',
        version,
        permalink,
        startTime,
        copyright,
        startYear,
        track,
        error: `
            <h3>Possible reasons for this error:</h3>
            <p>Every website checked had some sort of error...</p>
            <ul class="error">
                <li>Either they are all dead.</li>
                <li>Either they are all misconfigured.</li>
                <li>Or both!</li>
                <li>There is also the possibility that the last website you visited was the only one alive at the time.</li>
            </ul>
            <p>The webring is possibly completely bricked, sorry about that.</p>
        `,
        desc,
        path: null,
        staticPages
    })
}

module.exports = router
