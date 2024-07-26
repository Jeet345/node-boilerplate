const emailProvider = require('./email');

class Providers {
  constructor() {
    this.email = emailProvider;
  }
}

const providers = new Providers();
module.exports = providers;
