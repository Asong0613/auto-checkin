const obj = require("./demo-cookie");
const env = process.env;

/**
 * Created by huangqihong on 2022/1/8.
 */
module.exports = {
  COOKIE1: env.COOKIE || env.COOKIE1 || obj.COOKIE1,
  COOKIE2: env.COOKIE2 || obj.COOKIE2,
  COOKIE3: env.COOKIE3 || obj.COOKIE3,
  COOKIE4: env.COOKIE4 || obj.COOKIE4,
  COOKIE5: env.COOKIE5 || obj.COOKIE5,
  SERVERID: process.env.SERVERID || "", // server酱
};
