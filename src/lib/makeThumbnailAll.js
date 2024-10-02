const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const getPrettyDate = require('./getPrettyDate')

const thumbsDir = path.join('src/static/gen/thumbs')

async function makeThumbnailAll(websites, overwrite) {
    if (!fs.existsSync(thumbsDir)) fs.mkdirSync(thumbsDir, { recursive: true })

    try {
        let browser = await puppeteer.launch({
            defaultViewport: { width: 1920, height: 1080, },
            args: process.getuid && process.getuid() === 0 ? ['--no-sandbox'] : []
        })

        let page = await browser.newPage()

        for (let i in websites) {
            if (!fs.existsSync(path.join(thumbsDir, `${websites[i].slug}.jpg`)) || overwrite) {

                // if it fails, keep trying to download the next one
                try {
                    await page.goto(websites[i].url)
                    await delay(4000)
                    
                    let thumbBuffer = Buffer.from(await page.screenshot({ encoding: 'base64', quality: 90, type: 'jpeg' }), 'base64')

                    let imageBuffer = await sharp(thumbBuffer)
                    .resize({ width: 1600, height: 900 })
                    .toBuffer()

                    fs.writeFileSync(path.join(thumbsDir, `${websites[i].slug}.jpg`), imageBuffer)

                    console.log(`${getPrettyDate(new Date())}: Generated screenshot for website at index ${i}: ${websites[i].slug} (${websites[i].url}).`)
                } catch (error) {
                    console.error(`${getPrettyDate(new Date())}: Error generating screenshot for website at index ${i}: ${websites[i].slug} (${websites[i].url}) -- skipped.\n`, error)
                }
            }
        }

        console.log(`${getPrettyDate(new Date())}: Finished generating screenshots.`)
        await browser.close()
    } catch (error) {
        console.error(`${getPrettyDate(new Date())}: Puppeteer error!\n`, error)
    }
}

// creates a delay because they deprecated the thing that does that on puppeteer
// copied from stack overflow or something
function delay(time) {
    return new Promise(resolve => { 
        setTimeout(resolve, time)
    })
}

module.exports = makeThumbnailAll
