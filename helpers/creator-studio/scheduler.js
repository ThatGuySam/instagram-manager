const puppeteer = require('puppeteer');

export default class InstagramScheduler {
  constructor(email = "", password = "", multipleAccounts = false) {
    this.email = email;
    this.password = password;
    this.multipleAccounts = multipleAccounts;

    this.typingDelay = 40

    this.loggedIn = false
  }


  async mapElements () {

    // Map all js elements with new class names
    await this.page.evaluate(_ => {
      // Page context

      [...document.querySelectorAll('*[id^="js"], button, [role="button"]')].forEach(element => {
          const slug = element.innerText.toLowerCase()
              .replace(/[^\w ]+/g,'')
              .replace(/ +/g,'-')
              .substring(0, 20)
      
          console.log('slug', slug)
      
          if (slug.length === 0) return
      
          element.classList.add(slug)
      })

      // Page context
    });

    await this.page.waitFor(500);

  }

  async draftPost () {

    await this.page.waitForXPath(
      '//span[contains(text(), "Save as Draft")]'
    );
    await this.page.waitFor(500);

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

  async initPuppeteer() {
    if (this.page) {
      console.log('Puppeteer already initialized')
    }

    console.log('Initializing Puppeteer')

    this.browser = await puppeteer.launch({
      headless: false,
      args: [`--lang=en-GB`]
    });

    this.page = await this.browser.newPage();

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
    });


    console.log('Clicking "Log In or Sign Up" button')

    let loginButton = (await this.page.$$('[role="button"]'))[0];
    await loginButton.click();

    // Wait for login page to load
    await this.page.waitForNavigation({ waitUntil: "networkidle2" });
    
    // Look for email input
    await this.page.waitFor('input[name="email"]');

    console.log('Entering login data')

    await this.page.type('input[name="email"]', this.email, { delay: this.typingDelay });
    await this.page.type('input[name="pass"]', this.password, { delay: this.typingDelay });

    console.log('Clicking "Log In" button')

    loginButton = await this.page.$('button[name="login"]');
    await loginButton.click();


    console.log('Waiting for login response')

    await this.page.waitForNavigation({ waitUntil: "networkidle2" });

    return
  }

  async schedulePosts(posts) {


    const createButtonSelector = '#mediaManagerLeftNavigation [role="button"]'

    await this.initPuppeteer()

    await this.login()

    console.log('this.page.url()', this.page.url())

    
    console.log('Clicking on Instagram tab')

    let instagramButton = await this.page.$(
      'div[id="media_manager_chrome_bar_instagram_icon"]'
    );
    await instagramButton.click();

    await this.page.waitForNavigation({ waitUntil: "networkidle2" });


    console.log('Looking for create button')

    await this.page.waitFor(createButtonSelector);
    await this.page.waitFor(500);

    console.log('Found create button')

    for (let post of posts) {

      /* Click on "Create post" button */
      let createPostButton = await this.page.$(
        createButtonSelector
      );
      
      // await page.$x("//div[contains(text(), 'Create Post')]")
      
      
      await createPostButton.click();

      // Wait dropdown to open
      await this.page.waitFor(500);

      const instagramFeedButton = (await this.page.$x("//strong[contains(text(), 'Instagram Feed')]"))[0]
      await instagramFeedButton.click();

      if (this.multipleAccounts) {
        await this.page.waitForXPath("/html/body/div[5]/div/div/div[3]");
        await this.page.waitFor(500);

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

      await this.page.waitFor('div[aria-autocomplete="list"]');
      await this.page.waitFor(500);


      await this.mapElements()

      /* Add description */
      let descriptionInput = await this.page.$('div[aria-autocomplete="list"]');
      await descriptionInput.type(post.description, { delay: this.typingDelay });

      /* Add image file */
      const addContentButton = (await this.page.$x("//span[contains(text(), 'Add Content')]"))[1]
      // await this.page.waitFor('.add-contentshow-drop');
      // const addContentButton = this.page.$('.add-contentshow-drop')
      
      await addContentButton.click();

      await this.page.waitFor('input[accept="video/*, image/*"]');
      await this.page.waitFor(500);

      let fileInput = await this.page.$('input[accept="video/*, image/*"]');
      await fileInput.uploadFile(post.file);

      await this.mapElements()

      /* Click arrow button */
      const arrowButton = await this.page.$('button.dropdownbutton')
      await arrowButton.click();

      // Click Save as draft option
      const dropdownOptions = await this.page.$$('.uiContextualLayer [role="checkbox"]')
      const scheduleCheckbox = dropdownOptions[1]

      await scheduleCheckbox.click()

      await this.mapElements()

      await this.page.waitFor('input[placeholder="mm/dd/yyyy"]');

      /* Add release date */
      let dateInput = await this.page.$('input[placeholder="mm/dd/yyyy"]');
      await dateInput.type(post.release.date, { delay: this.typingDelay });
      await this.page.waitFor(500);

      /* Add release time */
      let releaseTime = post.release.time.split(":");
      let timeInput = await this.page.$$('input[role="spinbutton"]');
      let hourInput = timeInput[0];
      let minuteInput = timeInput[1];
      let periodInput = timeInput[2];

      await hourInput.type(releaseTime[0], { delay: this.typingDelay });
      await this.page.waitFor(500);

      await minuteInput.type(releaseTime[1], { delay: this.typingDelay });
      await this.page.waitFor(500);

      await periodInput.type(releaseTime[2], { delay: this.typingDelay });
      await this.page.waitFor(500);

      /* Click publish button */
      const publishButton = await this.page.$(
        'button.schedule'
      );
      await publishButton.click();

      // await this.mapElements()

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