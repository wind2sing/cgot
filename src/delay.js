const debug = require("debug")("cgot:delay");
const delay = require("delay");
const hooks = {
  beforeRequest: [
    async (options) => {
      if (options.context.delay) {
        if (Array.isArray(options.context.delay)) {
          debug(options.url.href, "delaying in range", options.context.delay);
          await delay.range(...options.context.delay);
        } else {
          debug(options.url.href, "delaying", options.context.delay);
          await delay(options.context.delay);
        }
      }
    },
  ],
};

const extendOptions = {
  hooks,
};
module.exports = extendOptions;
