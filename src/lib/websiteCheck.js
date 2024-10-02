const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const yaml = require('js-yaml')


const config = yaml.load(fs.readFileSync('config.yml', 'utf8'))
const permalink = config.permalink

async function websiteCheck(url, slug) {
    try {
        let response = await axios.get(url)
        let $ = cheerio.load(response.data)

        let iframes = $('iframe').map((i, element) => $(element).attr('src')).get()
        let hasIframe = iframes.some(src => {
            let urlParams = new URLSearchParams(src.split('?')[1])
            let websiteParam = urlParams.get('website')
        
            return websiteParam === slug && src.startsWith(`${permalink}/iframe`)
        })

        let hrefs = $('a').map((i, element) => $(element).attr('href')).get()
        let hasNextPrev = hrefs.some(url => { // this is the bare minimum for a website not to be skipped
            let urlParams = new URLSearchParams(url.split('?')[1])
            let websiteParam = urlParams.get('website')
            let actionParam = urlParams.get('action')
        
            return websiteParam === slug &&
                    ((url.startsWith(`${permalink}/redirect`) && actionParam === 'next') ||
                    (url.startsWith(`${permalink}/redirect`) && actionParam === 'prev'))
        })

        let configured = hasNextPrev || hasIframe

        let type
        if (hasNextPrev && hasIframe) {
            type = 'both'
        } else if (hasNextPrev) {
            type = 'manual'
        } else if (hasIframe) {
            type = 'iframe'
        } else {
            type = false // *this is why it returns false: <% if (websitesStatus[i].type) { %><%= websitesStatus[i].type %><% } %>
        }

        return {
            alive: true,
            configured: configured,
            type: type
        }
    } catch {
        return {
            alive: false,
            configured: false,
            type: false // *same here
        }
    }
}

module.exports = websiteCheck
