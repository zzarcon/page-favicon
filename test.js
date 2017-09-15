const del = require('node-delete');
const {statSync} = require('fs');
const getPageFavicon = require('.');
const httpPage = 'http://zzarcon.github.io';
const httpsPage = 'https://zzarcon.github.io';

const cleanUp = () => {
  del.sync('./favicon.ico');
  del.sync('./fixtures/*');
};

const existFile = path => statSync(path).isFile();

beforeAll(cleanUp);
afterAll(cleanUp);

test('default', async () => {
  const icon = await getPageFavicon(httpPage);

  await icon.save();

  expect(existFile('favicon.ico')).toBeTruthy();
});

test('specify destination', async () => {
  const destination = './fixtures/custom.ico';
  const icon = await getPageFavicon(httpPage);

  await icon.save(destination);

  expect(existFile(destination)).toBeTruthy();
});

test('https page', async () => {
  const icon = await getPageFavicon(httpsPage);

  await icon.save();

  expect(existFile('favicon.ico')).toBeTruthy();
});