const AbstractRouter = require('ticelli-bot/router');
const { Wit } = require('node-wit');

module.exports = class WitAiRouter extends AbstractRouter {
  constructor(...params) {
    super(...params);
    this.witInstance = new Wit({ accessToken: this.config.access_token })
  }

  async run(req) {
    if (this.witInstance && req.body.event && req.body.event.text) {
      req.wit = await this.witInstance.message(req.body.event.text);
    }
  }

  use(fn) {
    throw new Error('You cannot use something on WitAi router, excepted to be used only as middleware')
  }
};