const got = require("got").default;
function heartAPI({ db, col, heartUrl, username, password }={}) {
  username = username || process.env["HEART_USER"] || "admin";
  password = password || process.env["HEART_PASS"] || "secret";
  let prefixUrl = heartUrl || process.env["HEART_URL"];
  if (!prefixUrl) throw "Require parameter heartUrl or env HEART_URL!";
  if (db) prefixUrl += `/${db}`;
  if (col) prefixUrl += `/${col}`;

  const dbAPI = got.extend({
    username,
    password,
    prefixUrl,
    resolveBodyOnly: true,
    responseType: "json",
  });
  return dbAPI;
};
module.exports = heartAPI
