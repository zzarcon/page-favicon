// @flow

const puppeteer = require('puppeteer');
const http = require('http');
const https = require('https');
const {join} = require('path');
const fs = require('fs');
const {URL} = require('url');

const save = (url: URL) => async (directory = '.', fileName = 'favicon.ico') => {
  const get = url.protocol === 'https:' ? https.get : http.get;

  return new Promise((resolve, reject) => {
    get(url.href, res => {
      let rawData = '';

      res.setEncoding('binary');
      res.on('error', reject);
      res.on('data', chunk => rawData += chunk);
      res.on('end', () => {
        const destination = join(__dirname, directory, fileName);
        fs.writeFile(destination, rawData, 'binary', (err) => {
          if (err) return reject(err);

          console.log(destination, rawData.length);
          resolve(rawData);
        });
      });
    });
  });
};

module.exports = async (siteUrl: string) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(siteUrl);

  const faviconUrl = await page.evaluate(() => {
    const faviconElement = document.querySelector('link[rel*="icon"]');

    return faviconElement && faviconElement.getAttribute('href')
  });

  let url;

  try {
    url = new URL(faviconUrl, siteUrl)
  } catch (e) {
    return new Error(`error creating URL ${e}`);
  }

  browser.close();

  return {
    url,
    save: save(url)
  };
};