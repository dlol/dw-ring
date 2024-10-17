<h1 style="margin-bottom: -15px;">dw-ring</h1>

*dw-ring is an overengineered webring*

dw-ring -- dw's webring. The goal of this project is to have a backend-first webring software that is extremely failure tolerant. Most webrings use frontend scripts, they work well, and I totally respect them, but what if someone doesn't want to use JavaScript on their site? Or what if a site goes offline for a bit, maybe the webmaster simply removed the links, thus breaking the webring. This project aims to fix this by employing extreme measures, that are maybe overkill, but that was my goal: make a very failure tolerant webring. Additionally it has a bunch of cool stuff on the frontend, like dynamic thumbnail generation for each site, and the caching of assets instead of hotlinking, and just a bunch of eye-candy.

## Features

### General

- Dynamic thumbnail generation with `puppeteer`
- Dynamic website statuses (alive?, configured?, type of config)
- Static website descriptions (config)
- Static website join dates (config)
- Static webring welcome text with html support (config)
- Websites are listed with nice cards with thumbnails, buttons and favicons
- Favicons and banners are downloaded from the URLs in the config, so they will load even if a site is down
- Using `src/dlassets.js` will download/generate the images
- Passing `--overwrite` will overwrite previously downloaded files
- The ability to use an iframe
- The ability to also use manual links, the bare minimum being prev/next links
- The skipping of websites that are down or misconfigured
- Offline websites get a "search on archive.org" link
- The iframe will warn you if you misspell the slug
- Easy hosting with docker

### Redirections

- **/redirect?website=[SLUG]&action=next**: Will redirect you to the next working website
- **/redirect?website=[SLUG]&action=prev**: Will redirect you to the previous working website
- **/redirect?website=[SLUG]&action=random**: Will redirect you to a random working website different from the one specified in the website param
- **/redirect?action=random**: Will redirect you to a random working website
- **/redirect?action=first**: Will redirect you to the first available website
- **/redirect?action=last**: Will redirect you to the last available website

### iframe

- **/iframe**: Will render an iframe with `[first|last|random w/o check]` buttons
- **/iframe?website=[SLUG]**: Will render an iframe with `[prev|next|random w/ check]` buttons
