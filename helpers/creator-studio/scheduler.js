// https://pptr.dev/
const puppeteer = require('puppeteer');

const defaultPupperteerTimeout = 0

const createButtonSelector = '[selector-create-post], .create-post'
const createNewButtonXPath = "//div[ contains(., 'Create New') and @role='button' ]"
const createPostButtonXPath = "//div[ contains(., 'Create post') and @role='button' ]"
const clickableSelector = 'button, [role="button"], [role="link"]'





function sleep( time ) {
  return new Promise(r => setTimeout(r, time))
}


export default class InstagramScheduler {
  constructor(email = "", password = "", multipleAccounts = false) {
    this.email = email;
    this.password = password;
    this.multipleAccounts = multipleAccounts;

    this.typingDelay = 40

    this.loggedIn = false
  }

  async findElementWithText ( text ) {
    const clickableElementsWithTextJson = await this.page.evaluate( ({ clickableSelector, text }) => {
      const clickableElements = Array.from( document.querySelectorAll( clickableSelector ) )

      const clickableElementsWithText = clickableElements.filter( element => element.innerText.toLowerCase() === text.toLowerCase() )
        .map( element => ({
          innerText: element.textContent,
          classesSelector: '.' + Array.from( element.classList ).join('.'),
          // element
        }))

      // Must return string
      return JSON.stringify( clickableElementsWithText )
    }, { clickableSelector, text } )

    const clickableElementsWithText = JSON.parse( clickableElementsWithTextJson )

    // console.log('clickableElementsWithText', clickableElementsWithText)

    return clickableElementsWithText
  }

  async clickWithJs ( selector ) {
    await this.page.evaluate( ({ selector }) => {
      const elementToClick = document.querySelector( selector )

      elementToClick.click()

      return
    }, { selector } )
  }

  async findAndClick ( options = {} ) {
    const {
      friendlyName,
      reference,
      jsClick = false
    } = options

    await this.mapElements()

    const isXPath = reference.startsWith('//')
    // const referenceType = isXPath ? 'xpath' : 'selector'

    console.log(`Looking for ${friendlyName} as ${reference}`)

    if ( isXPath ) {
      await this.page.waitForXPath( reference )
    } else {
      await this.page.waitForSelector( reference )
    }
    
    const matchingElements = isXPath ? await this.page.$x( reference ) : await this.page.$$( reference )

    // Get elements matching reference
    const [ elementHandle ] = matchingElements

    console.log(`Found ${matchingElements.length} "${friendlyName}" element with ${reference}`)

    // console.log('elementHandle', elementHandle._page)

    if ( typeof elementHandle === 'undefined' ) {
      throw new Error(`"${friendlyName}" is not defined`, reference, elementHandle)
    }

    if ( typeof elementHandle.click !== 'function' ) {
      throw new Error(`"${friendlyName}" does not have click method`, reference, elementHandle)
    }

    console.log(`Clicking ${friendlyName} with ${reference}`)

    console.log('elementHandle.click', elementHandle.click)

    if ( jsClick ) {
      if ( isXPath ) throw new Error('XPath is not supported for jsClick')

      await this.clickWithJs( reference )
    } else {
      await elementHandle.click()
    }

    console.log('\n\n')

    return elementHandle
  }


  async mapElements () {

    // Map all js elements with new class names
    const mappedElementsJson = await this.page.evaluate(_ => {
      // Page context

      const mappedElements = {};

      [ ...document.querySelectorAll('*[id^="js"], button, [role="button"]') ].forEach(element => {
          const slug = element.innerText.toLowerCase()
              .replace(/[^\w ]+/g,'')
              .replace(/ +/g,'-')
              .substring(0, 20)
      
          console.log('slug', slug)
      
          if (slug.length === 0) return
      
          element.classList.add(slug)

          element.setAttribute(`selector-${slug}`, true)

          const {
            className,
            classList,
            attributes
          } = element

          const elementAtributes = Object.fromEntries( Object.values(attributes).map( attributeName => [attributeName, element[attributeName]]) )

          mappedElements[element.innerText] = {
            ...elementAtributes,
            className,
            classList,
            attributes
          }
      })

      console.log('mappedElements during evaluate', mappedElements)

      // TODO: Return mapped elements
      return JSON.stringify( mappedElements )

      // End page context
    });

    // console.log('mappedElementsJson after evaluate', mappedElementsJson)

    await sleep( 500 )

    return JSON.parse( mappedElementsJson )
  }

  async draftPost () {

    await this.page.waitForXPath(
      '//span[contains(text(), "Save as Draft")]'
    )

    await sleep( 500 )

    // Click Save as draft option
    const dropdownOptions = await this.page.$$('.uiContextualLayer [role="checkbox"]')
    const saveAsDraftCheckbox = dropdownOptions[2]

    await saveAsDraftCheckbox.click()

    await this.mapElements()

    const saveAsDraftButton = await this.page.$('button.save-as-draft')

    await saveAsDraftButton.click()

    await this.page.waitForFunction(
      `document.querySelector('body').innerText.includes('Your draft has been saved.')`
    )

  }

  async initPuppeteer () {
    if (this.page) {
      console.log('Puppeteer already initialized')
    }

    console.log('Initializing Puppeteer')

    this.browser = await puppeteer.launch({
      headless: false,
      args: [`--lang=en-GB`]
    })

    this.page = await this.browser.newPage()

    // Set page timeout
    // https://pptr.dev/#?product=Puppeteer&show=api-pagesetdefaulttimeouttimeout
    this.page.setDefaultTimeout( defaultPupperteerTimeout )

    // Set navigattion timeout
    // Overrides setDefaultTimeout
    // https://pptr.dev/#?product=Puppeteer&show=api-pagesetdefaultnavigationtimeouttimeout
    // this.page.setDefaultNavigationTimeout( defaultPupperteerTimeout )

    await this.page.setViewport({
      width: 1680,
      height: 862
    })
  }

  async login() {
    if (this.loggedIn) {
      console.log('Already logged in')
      return
    }
    
    console.log('Logging in to Facebook Creator Studio')

    await this.page.goto("https://www.facebook.com/creatorstudio/", {
      waitUntil: "networkidle2"
    })


    // console.log('Clicking "Log In or Sign Up" button')
    await this.findAndClick({
      friendlyName: 'Log In or Sign Up',
      reference: '[role="button"]'
    })

    // Wait for login page to load
    await this.page.waitForNavigation({ waitUntil: "networkidle2" })
    
    // Look for email input
    await this.page.waitForSelector('input[name="email"]')

    console.log('Entering login data')

    await this.page.type('input[name="email"]', this.email, { delay: this.typingDelay })
    await this.page.type('input[name="pass"]', this.password, { delay: this.typingDelay })

    console.log('Clicking "Log In" button')

    await this.findAndClick({
      friendlyName: 'Log In Button',
      reference: 'button[name="login"]'
    })


    console.log('Waiting for login response')

    await this.page.waitForNavigation({ waitUntil: "networkidle2" })

    return
  }

  async schedulePosts(posts) {

    await this.initPuppeteer()

    await this.login()

    console.log('this.page.url()', this.page.url())

    const instagramTabSelector = 'div[id="media_manager_chrome_bar_instagram_icon"]'

    await this.findAndClick({
      friendlyName: 'Instagram Tab Button',
      reference: instagramTabSelector
    })

    await this.page.waitForNavigation({ waitUntil: "networkidle2" })

    // Wait for react to render dom
    await sleep( 500 )

    for (let post of posts) {

      // Map elements so Create Post button is findable
      await this.mapElements()

      await sleep( 500 )

      const createPostElements = await this.findElementWithText( 'Create post' )

      // console.log('Elements with "Create post"', createPostElements)

      const [ 
        {
          classesSelector: createPostButtonSelector
        }
      ] = createPostElements

      // const createPostButtonSelector = '#mediaManagerFacebookComposerLeftNavButton [role="button"]'

      await this.findAndClick({
        friendlyName: 'Create New Button',
        reference: createPostButtonSelector,
        jsClick: true
      })

      // Wait dropdown to open
      await sleep( 500 )

      await this.findAndClick({
        friendlyName: 'Instagram Feed Option',
        reference: `//strong[contains(text(), 'Instagram Feed')]`
      })

      if (this.multipleAccounts) {
        await this.page.waitForXPath("/html/body/div[5]/div/div/div[3]")
        await sleep( 500 )

        /* Select instagram account */
        let accounts = (
          await this.page.$x("/html/body/div[5]/div/div/div[3]")
        )[0];
        let accountButton = (
          await accounts.$x(
            `/html/body/div[5]/div/div/div[3]/div/span/div[2]/span/div[contains(text(), "${post.account}")]`
          )
        )[0];
        await accountButton.click();
      }

      await this.page.waitForSelector('div[aria-autocomplete="list"]')
      await sleep( 500 )


      await this.mapElements()

      console.log('Typing post description')

      /* Add description */
      let descriptionInput = await this.page.$('div[aria-autocomplete="list"]');
      await descriptionInput.type(post.description, { delay: this.typingDelay });

      /* Add image file */
      await this.findAndClick({
        friendlyName: 'Add Content Button',
        reference: '.add-contentshow-drop'
      })


      console.log('Looking for upload input')
      await this.page.waitForSelector('input[accept*="image/*"]')
      await sleep( 500 )


      console.log('Uploading post image')

      let fileInput = await this.page.$('input[accept*="image/*"]')
      await fileInput.uploadFile(post.file)

      await this.mapElements()



      /* Click arrow button */
      await this.findAndClick({
        friendlyName: 'Publish Arrow Button',
        reference: 'button.dropdownbutton'
      })

      await this.findAndClick({
        friendlyName: 'Schedule Post Option',
        reference: '.uiContextualLayer div:nth-child(2) [role="checkbox"]',
        jsClick: true
      })

      await this.mapElements()


      await this.page.waitForSelector('input[placeholder="mm/dd/yyyy"]');

      /* Add release date */
      let dateInput = await this.page.$('input[placeholder="mm/dd/yyyy"]');
      await dateInput.type(post.release.date, { delay: this.typingDelay });
      await sleep( 500 )

      /* Add release time */
      let releaseTime = post.release.time.split(":");
      let timeInput = await this.page.$$('input[role="spinbutton"]');
      let hourInput = timeInput[0];
      let minuteInput = timeInput[1];
      let periodInput = timeInput[2];

      await hourInput.type(releaseTime[0], { delay: this.typingDelay });
      await sleep( 500 )

      await minuteInput.type(releaseTime[1], { delay: this.typingDelay });
      await sleep( 500 )

      await periodInput.type(releaseTime[2], { delay: this.typingDelay });
      await sleep( 500 )


      /* Click Schde button */
      await this.findAndClick({
        friendlyName: 'Confirm Schedule Button',
        reference: 'button.schedule'
      })

      // Wait for post confirmation notification
      await this.page.waitForFunction(
        `document.querySelector('body').innerText.includes('Your post has been successfully scheduled.')`
      )


      await post.callback()
    }
  }

  async close() {
    await this.page.close();
    await this.browser.close();
  }
}

// module.exports = InstagramScheduler