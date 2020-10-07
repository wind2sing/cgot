const got = require("got").default;
const { loadCheerio, parse: parseIt } = require("cparse");
const debugHttp = require("./debug-http")();
function create({ filters = {}, cheerioOptions = {}, userAgent } = {}) {
  const instance = got.extend(debugHttp, {
    mutableDefaults: true,
    hooks: {
      afterResponse: [add$, parseRes],
    },
  });

  instance.filters = function addFilters(newFilters = {}) {
    Object.assign(filters, newFilters);
    return instance;
  };
  instance.cheerio = function addCheerioOptions(options = {}) {
    Object.assign(cheerioOptions, options);
    return instance;
  };
  instance.userAgent = function (ua) {
    instance.defaults.options.headers["user-agent"] = getDefaultUA(ua);
    return instance;
  };
  instance.recreate = create;

  if (userAgent) instance.userAgent(userAgent);
  return instance;

  function add$(res) {
    if (
      /^text\/(html|xml)(?:;.*)?/.test(res.headers["content-type"] || "") &&
      res.body &&
      !res.request.options.disableCheerio
    ) {
      res.$ = loadCheerio(res.body, cheerioOptions, res.url);
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
      if (options.parse) res.parsed = parseIt(options.parse, res.$, filters);
    }
    return res;
  }
}
module.exports = create;

function getDefaultUA(ua) {
  return (
    ua ||
    process.env["DEFAULT_UA"] ||
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
  );
}
