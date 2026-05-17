const fs = require('fs');
const path = require('path');
const appJson = require('./app.json');

const googleServicesPath = path.join(__dirname, 'google-services.json');
const android = {
  ...appJson.expo.android,
  ...(fs.existsSync(googleServicesPath)
    ? { googleServicesFile: './google-services.json' }
    : {}),
};

module.exports = {
  expo: {
    ...appJson.expo,
    android,
  },
};
