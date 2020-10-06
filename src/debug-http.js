const got = require("got").default;
const debug = require("debug")("cgot:http-ok");
const warn = require("debug")("cgot:http-error");
function create() {
  return got.extend({
    hooks: {
      afterResponse: [
        (r) => {
          const message = `${r.request.options.method} ${r.url} - ${r.statusCode} (${r.timings.phases.total} ms)`;
          if (r.statusCode >= 300) warn(message);
          else debug(message);
          return r;
        },
      ],
    },
  });
}
module.exports = create;