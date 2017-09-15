// @flow

const puppeteer = require('puppeteer');
const {URL} = require('url');
const saveImage = require('save-image');

const save = (url /*: URL*/) => async (destination /*: string*/) => {
  await saveImage(url.href, destination);
};

module.exports = async (siteUrl /*: string*/) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(siteUrl);

  const faviconUrl = await page.evaluate(() => {
    const faviconElement = document.querySelector('link[rel*="icon"]');

    return faviconElement && faviconElement.getAttribute('href')
  });

  let url;

  try {
    url = new URL(faviconUrl, siteUrl);
  } catch (e) {
    return new Error(`error creating URL ${e}`);
  }

  browser.close();

  return {
    url,
    save: save(url)
  };
};