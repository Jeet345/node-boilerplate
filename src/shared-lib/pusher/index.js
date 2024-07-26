const Pusher = require('pusher');

const CONFIG = require('../../config/config');

const pusher = new Pusher({
  appId: CONFIG.PUSHER.APP_ID,
  key: CONFIG.PUSHER.KEY,
  secret: CONFIG.PUSHER.SECRET,
  cluster: CONFIG.PUSHER.CLUSTER,
  useTLS: true,
  encryptionMasterKeyBase64: CONFIG.PUSHER.ENCRYPTION_MASTER_KEY,
});

module.exports = pusher;
