const got = require("got").default;
const { loadCheerio, parse: parseIt } = require("cparse");
const pThrottle = require("p-throttle");
const debugHttp = require("./debug-http");
const delayOptions = require("./delay");
const proxyOptions = require("./proxy");

function create({
  filters = {},
  cheerio = {},
  userAgent,
  disableParse,
  delay,
  proxy,
  throttle,
} = {}) {
  const instance = got.extend(delayOptions, debugHttp, proxyOptions, {
    mutableDefaults: true,
    hooks: {
      beforeRequest: [],
      afterResponse: disableParse ? [] : [add$, parseRes],
    },
  });

  instance.filters = function addFilters(newFilters = {}) {
    Object.assign(filters, newFilters);
    return instance;
  };
  instance.cheerio = function addCheerioOptions(options = {}) {
    Object.assign(cheerio, options);
    return instance;
  };
  instance.userAgent = function (ua) {
    instance.defaults.options.headers["user-agent"] = getDefaultUA(ua);
    return instance;
  };

  instance.delay = function (ms) {
    instance.defaults.options["delay"] = ms;
    return instance;
  };

  instance.delayRange = function (dr) {
    instance.defaults.options["delayRange"] = dr;
    return instance;
  };

  instance.proxy = function (proxy) {
    instance.defaults.options["proxy"] = proxy;
    return instance;
  };

  instance.throttle = function (throttleOptions) {
    const _throttled = pThrottle(throttleOptions);
    return _throttled(this);
  };

  instance.recreate = create;

  if (userAgent) instance.userAgent(userAgent);
  if (delay) instance.delay(delay);
  if (proxy) instance.proxy();
  if (throttle) return instance.throttle(throttle);
  return instance;

  function add$(res) {
    if (
      /^text\/(html|xml)(?:;.*)?/.test(res.headers["content-type"] || "") &&
      res.body &&
      !res.request.options.disableCheerio
    ) {
      res.$ = loadCheerio(res.body, cheerio, res.url);
    }
    return res;
  }

  function parseRes(res) {
    if (res.$) {
      let { options } = res.request;
      if (options.parseCheck) {
        const checkResult = options.parseCheck(res);
        if (!checkResult) return res;
      }
      res.parseIt = function (rule) {
        return parseIt(rule, res.$, filters);
      };
      if (options.parse) res.parsed = parseIt(options.parse, res.$, filters);
    }
    return res;
  }
}
module.exports = create;

function getDefaultUA(ua) {
  return (
    ua ||
    process.env["CGOT_UA"] ||
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
  );
}
