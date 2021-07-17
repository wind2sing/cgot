const debug = require("debug")("cgot:delay");
const delay = require("delay");
const hooks = {
  beforeRequest: [
    async (options) => {
      if (options.delay) {
        if (Array.isArray(options.delay)) {
          debug(options.url.href, "delaying in range", options.delay);
          await delay.range(...options.delay);
        } else {
          debug(options.url.href, "delaying", options.delay);
          await delay(options.delay);
        }
      }
    },
  ],
};

const extendOptions = {
  hooks,
};
module.exports = extendOptions;
