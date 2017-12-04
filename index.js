const AbstractRouter = require('ticelli-bot');

const { Wit } = require('node-wit');

module.exports = class WitAiRouter extends AbstractRouter {
  constructor(config) {
    super({}, config);
    this.witInstance = new Wit({ accessToken: this.config.access_token });
  }

  async run(train) {
    const { event } = train.request.body;
    if (event.text) {
      const { entities } = await this.witInstance.message(event.text);

      train.intents = Object.assign(train.intents || {}, Object.keys(entities).reduce((o, name) => {
        o[name] = entities[name].map(({ value }) => value);
        return o;
      }, {}));

      train.entities = Object.keys(entities).reduce((o, name) => {
        const info = entities[name];
        if (info.map(v => ['value', 'interval'].includes(v.type)).reduce((a, b) => a || b, false)) {
          o[name] = info;
        }
        return o;
      }, {});
    }
  }
};
