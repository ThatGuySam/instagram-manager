const puppeteer = require('puppeteer')

const currentDomain = require('./currentDomain')

/**
 * Takes a screenshot of a DOM element on the page, with optional padding.
 *
 * @param {!{path:string, selector:string, padding:(number|undefined)}=} opts
 * @return {!Promise<!Buffer>}
 */
async function screenshotDOMElement(opts = {}, page) {
    const padding = 'padding' in opts ? opts.padding : 0;
    const path = 'path' in opts ? opts.path : null;
    const selector = opts.selector;

    if (!selector)
        throw Error('Please provide a selector.');

    const rect = await page.evaluate(selector => {
        const element = document.querySelector(selector);
        if (!element)
        return null;
        const {x, y, width, height} = element.getBoundingClientRect();
        return {left: x, top: y, width, height, id: element.id};
    }, selector);

    if (!rect)
        throw Error(`Could not find element that matches selector: ${selector}.`);

    return await page.screenshot({
        path,
        clip: {
            x: rect.left - padding,
            y: rect.top - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2
        }
    });
}
  

module.exports = async function (redditPost) {

    const browserWidth = 1500
    const browserHeight = 1500
    const domain = currentDomain.get()
    const mockupUrl = `${domain}/post-mockup/${redditPost.data.name}`
    const mockupSelector = '#mockup'
    const filePath = `./static/memes/${redditPost.data.name}.png`


    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    page.setViewport({ width: browserWidth, height: browserHeight, deviceScaleFactor: 1 })

    await page.goto(mockupUrl, { waitUntil: 'networkidle2' })

    await screenshotDOMElement({
        path: filePath,
        selector: mockupSelector,
        // padding: 16
    }, page)

    await browser.close()

    return filePath
}
