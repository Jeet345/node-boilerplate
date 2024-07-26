const logger = require('../../logger');

const pusher = require('.');

const pusherAuth = (req, res) => {
  const { ctx, body: { socket_id: socketId, channel_name: channelName } } = req;
  try {
    const auth = pusher.authenticate(socketId, channelName);
    res.send(auth);
  } catch (err) {
    logger.error(`Error in pusherAuth: ${err}`, ctx);
    res.sendStatus(500);
  }
};

module.exports = pusherAuth;
