const { gotScraping: got } = require("got-scraping");
const { loadCheerio, parse: parseIt } = require("cparse");
const debugHttp = require("./debug-http");
const delayOptions = require("./delay");
const proxyOptions = require("./proxy");
const PQueue = require("p-queue").default;

function create({
  filters = {},
  cheerio = {},
  userAgent,
  disableParse,
  delay,
  proxy,
  queue,
} = {}) {
  const instance = got.extend(delayOptions, debugHttp, proxyOptions, {
    mutableDefaults: true,
    hooks: {
      init: [
        (raw, options) => {
          for (const key in raw) {
            if (!(key in options)) {
              options.context[key] = raw[key];
              delete raw[key];
            }
          }
        },
      ],
      beforeRequest: [
        (options) => {
          // All custom options will be visible under `options.context`
          for (const key in options.context) {
            options[key] = options.context[key];
          }
        },
      ],
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

  instance.queue = function (queueOptions) {
    const queue = new PQueue(queueOptions);

    const queuedInstance = function (...args) {
      return queue.add(() => {
        return instance.apply(this, args);
      });
    };
    queuedInstance._queue = queue;
    return queuedInstance;
  };
  instance.recreate = create;

  if (userAgent) instance.userAgent(userAgent);
  if (delay) instance.delay(delay);
  if (proxy) instance.proxy();
  if (queue) return instance.queue(queue);
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
