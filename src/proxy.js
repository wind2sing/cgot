const ProxyAgent = require("proxy-agent");
const debug = require("debug")("cgot:proxy");

const hooks = {
  beforeRequest: [
    async (options) => {
      if (options.proxy) {
        let proxyUri;
        if (typeof options.proxy == "string") {
          proxyUri = options.proxy;
        }

        if (typeof options.proxy == "function") {
          proxyUri = options.proxy(options);
        }
        if (proxyUri) {
          debug(proxyUri, options.url.href);
          if (!options.agent) options.agent = {};
          options.agent.http = new ProxyAgent(proxyUri);
          options.agent.https = new ProxyAgent(proxyUri);
        }
      }
    },
  ],
};

const extendOptions = {
  hooks,
};
module.exports = extendOptions;
