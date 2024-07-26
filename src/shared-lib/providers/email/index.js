const MailMonkey = require('./mail-monkey');
const Sendbay = require('./sendbay');

class Email {
  constructor(config) {
    const { provider, providerConfig = {}, options = {} } = config;
    this.provider = provider;
    this.providerConfig = providerConfig;
    this.options = options;
  }

  async sendEmail(emailData) {
    let response;
    if (this.provider === 'MAIL_MONKEY') {
      const mailMonkey = new MailMonkey(this.providerConfig, this.options);
      response = await mailMonkey.sendEmail(emailData);
    }
    if (this.provider === 'SENDBAY') {
      const sendbay = new Sendbay(this.providerConfig, this.options);
      response = await sendbay.sendEmail(emailData);
    }
    return response;
  }
}

module.exports = Email;
