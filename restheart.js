const username = process.env["HEART_USER"] || "admin";
const password = process.env["HEART_PASS"] || "secret";
const got = require("got").default;
module.exports = function heartAPI({ db, col, heartUrl }) {
  let prefixUrl = heartUrl || process.env["HEART_URL"];
  if (!prefixUrl) throw "Require env HEART_URL or parameter heartUrl !";
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
