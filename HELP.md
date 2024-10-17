## Instructions

dw-ring will automatically verify that your website is online and configured correctly, if any of these fail your site is simply going to be skipped as to not break the ring.

There are two ways you can "configure" your website to join the webring:

<br>

### Using the iframe

You can use the `/iframe?website=[YOUR_SLUG]` route and embed it on your website.

`<iframe src="[YOUR_PERMALINK]/iframe?website=[YOUR_SLUG]" frameborder="0" height="50" width="280"></iframe>`

<iframe src="/iframe?website=diogo" frameborder="0" height="50" width="280"></iframe>

^This is what it looks like configured with my site (**konakona.moe**).

<iframe src="/iframe?website=blahblahblahblah" frameborder="0" height="50" width="280"></iframe>

^You will see this if you misstype or aren't on the webring.

<br>

### Manually Adding Links

If you don't want to use the iframe, you can manually add the `next` and `prev` <em>as a bare minimum</em> to your site.

`[YOUR_PERMALINK]/redirect?website=[YOUR_SLUG]&action=prev`

`[YOUR_PERMALINK]/redirect?website=[YOUR_SLUG]&action=next`

You can also use the "random" action with your website's url on the website param (but you're not obligated to):

`[YOUR_PERMALINK]/redirect?website=[YOUR_SLUG]&action=random`

And a link to the index of the webring if you'd like.

`[YOUR_PERMALINK]/`


> ***Notes:***
>
> - `[YOUR_SLUG]` means your site's "slug" which is simply a string without any special characters, hover over the url of your site in the index to find your site's slug, or ask the owner or something!
> - If your site is not on the Webring (e.g. misspelled *slug*) you will probably [get an error like this](/redirect). The iframe will also warn you, but this is only possible with the iframe.
> - I would have liked to check the *referrer* header to see if a site is an "imposter" but it can be spoofed and frankly nobody cares, like this thing is already overkill.


<br>

### Site Agnostic iframe and Redirections

If you are not part of the webring you can still embed the iframe (like the one in the footer), just remove the website param and its value:

`<iframe src="[YOUR_PERMALINK]/iframe" frameborder="0" height="50" width="280"></iframe>`

This iframe includes 3 redirections: [`first`|`last`|`random (w/o checking if it's the same site)`] that you can use without it.

`[YOUR_PERMALINK]/redirect?action=first`

`[YOUR_PERMALINK]/redirect?action=last`

`[YOUR_PERMALINK]/redirect?action=random`
