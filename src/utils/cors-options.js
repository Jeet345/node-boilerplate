const CONFIG = require('../config/config');

const corsOptionsDelegate = (req, callback) => {
  const allowlistOrigins = CONFIG.WEB_URLS && CONFIG.WEB_URLS.length > 0 ? CONFIG.WEB_URLS.split(',') : ['http://localhost:3000'];
  let corsOptions = {
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    exposedHeaders: ['Content-Type', 'Content-Length', 'Content-Disposition'],
  };
  if (allowlistOrigins.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { ...corsOptions, origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

module.exports = corsOptionsDelegate;
