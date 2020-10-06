const got = require("got").default;
const { loadCheerio, parse: parseIt } = require("cparse");
const debugHttp = require("./debug-http")();
function create({ filters = {}, cheerioOptions = {} } = {}) {
  const instance = got.extend(debugHttp, {
    hooks: {
      afterResponse: [
        function add$(res) {
          if (
            /^text\/(html|xml)(?:;.*)?/.test(
              res.headers["content-type"] || ""
            ) &&
            res.body &&
            !res.request.options.disableCheerio
          ) {
            res.$ = loadCheerio(res.body, cheerioOptions, res.url);
          }
          return res;
        },
        function parseRes(res) {
          if (res.$) {
            let { parse, parseCheck } = res.request.options;
            if (parseCheck) {
              const checkResult = parseCheck(res);
              if (!checkResult) return;
              if (["object", "string", "function"].includes(typeof checkResult))
                parse = checkResult;
            }
            if (parse) res.parsed = parseIt(rule, res.$, filters);
          }
          return res;
        },
      ],
    },
  });
  instance.filters = function addFilters(newFilters = {}) {
    Object.assign(filters, newFilters);
  };
  instance.cheerio = function addCheerioOptions(options = {}) {
    Object.assign(cheerioOptions, options);
  };
  instance.recreate = create;
  return instance;
}
module.exports = create;
