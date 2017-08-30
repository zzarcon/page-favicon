const getPageFavicon = require('.');

(async () => {
  const icon = await getPageFavicon('https://www.google.com');
  const base64 = await icon.save('./fixtures', 'custom.ico');

  console.log(base64);
})();