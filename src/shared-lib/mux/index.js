const Mux = require('@mux/mux-node').default;
const axios = require('axios').default;

const CONFIG = require('../../config/config');

const MuxObj = new Mux(CONFIG.MUX.TOKEN_ID, CONFIG.MUX.TOKEN_SECRET);

const { Video, Data } = MuxObj;

const muxClient = axios.create({
  baseURL: CONFIG.MUX.ENDPOINT,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  },
});

module.exports = {
  muxClient,
  muxVideo: Video,
  muxData: Data,
};
