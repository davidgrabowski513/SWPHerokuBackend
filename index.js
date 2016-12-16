	// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://heroku_2p78v381:rv9pqbcelp1tlq29ig8hkqv7s7@ds053206.mlab.com:53206/heroku_2p78v381',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || '4CmO6BLVjSMbePZuchiGnxpaMJK2xQECqq7GQ458',
  fileKey: 'cc8f63d3-24f4-4f6a-a78e-328bd39132ec',
  masterKey: process.env.MASTER_KEY || '0Jra71v1Pd6SSMWf7MOz3amPML4FWbyTQZAWLgQN', //Add your master key here. Keep it secret!
  restAPIKey: process.env.REST_API_KEY || 'sJIkhq2mtsIl8uMwcySitZP2dDYVWgD3Byb6PEjw',
  javascriptKey: process.env.JAVASCRIPT_KEY || 'i6ow3Npsnewy6jggB5Si3QvTIHCJsqNNWv3zbdYr',
  clientKey: process.env.CLIENT_KEY || "U7ldg5OZHasuU4o7UFEV0yBw47Fdf0VSfJWLAqRc",
  serverURL: process.env.SERVER_URL || 'http://sportsworldpassportdatabase.herokuapp.com/parse',  // Don't forget to change to https if needed
  enableAnonymousUsers: process.env.ANON_USERS || true,
  allowClientClassCreation: process.env.CLIENT_CLASS_CREATION || true,
  liveQuery: {
    classNames: ["Comment", "Feed", "Follow", "HashTags", "News", "Stamp"] // List of classes to support for query subscriptions
  },
  push: {
    'ios': [{
      pdx: '/cert/Certificates.p12', // the path and filename to the .p12 file you exported earlier.
      bundleId: 'com.boydlee.sportworldpassport', // The bundle identifier associated with your app
      production: true
    },{
      pdx: '/cert/swp_dev_apns.p12', // the path and filename to the .p12 file you exported earlier.
      bundleId: 'com.boydlee.sportworldpassport', // The bundle identifier associated with your app
      production: false
    },{
      pdx: '/cert/sportsWorld_apn_160419.p12', // the path and filename to the .p12 file you exported earlier.
      bundleId: 'com.uwp.SportWorldPassport1', // The bundle identifier associated with your app
      production: false
    }]
  },
  //password reset
  //verifyUserEmails: true,
  //emailVerifyTokenValidityDuration: 2*60*60,
  //preventLoginWithUnverifiedEmail: false,
  publicServerURL: 'https://sportsworldpassportdatabase.herokuapp.com/parse',
  appName: 'Sport World Passport',
  emailAdapter: {
	  module: 'parse-server-simple-mailgun-adapter',
	  options : {
      // The address that your emails come from
      fromAddress: 'no-reply@sportsworldpassport.com',
      // Your domain from mailgun.com
      domain: 'sportworldpassport.com',
      // Your API key from mailgun.com
      apiKey: 'key-b7307a07a3145ac40891003b61cc639f',
		   //password reset
	  passwordResetSubject: 'Password Reset Request for SportWorldPassport',
      passwordResetBody: 'Hi,\n\nYou requested a password reset for %appname%.\n\nClick here to reset it:\n%link%'
    }
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
