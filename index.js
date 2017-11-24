const AbstractRouter = require('ticelli-bot/router');
const merge = require('lodash.merge');

const { Wit } = require('node-wit');

module.exports = class WitAiRouter extends AbstractRouter {
  constructor(...params) {
    super(...params);
    this.witInstance = new Wit({ accessToken: this.config.access_token })
  }

  async run(req) {
    if (req.body.event && req.body.event.text) {
      req.wit = await this.witInstance.message(req.body.event.text);
      Object.defineProperty(req, 'intent', {
        get() {
          const { entities } = req.wit;
          return Object.keys(entities).reduce((o, name) => {
            const info = entities[name].reduce(merge);
            if (info.type !== 'value') {
              o[name] = info;
            }
            return o;
          }, {});
        }
      });
      Object.defineProperty(req, 'entities', {
        get() {
          const { entities } = req.wit;
          return Object.keys(entities).reduce((o, name) => {
            const info = entities[name];
            if (info.map(v => ['value', 'interval'].includes(v.type)).reduce((a, b) => a || b, false)) {
              o[name] = info;
            }
            return o;
          }, {});
        }
      });
    }
  }

  use(fn) {
    throw new Error('You cannot use something on WitAi router, excepted to be used only as middleware')
  }
};