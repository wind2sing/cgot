const ProxyAgent = require("proxy-agent");
const debug = require("debug")("cgot:proxy");

const hooks = {
  beforeRequest: [
    async (options) => {
      if (options.proxy) {
        let proxyUri;
        let type = typeof options.proxy;
        if (type == "string" || type == "object") {
          proxyUri = options.proxy;
        }

        if (type == "function") {
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
