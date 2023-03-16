const request = require("../utils/request");
const { getCookie } = require("../utils/setCookie");

module.exports = function () {
  return {
    /**
     * 签到
     */
    checkIn: function () {
      return request({
        url: "https://api.juejin.cn/growth_api/v1/check_in",
        method: "post",
        headers: {
          cookie: getCookie(),
        },
      });
    },
    /**
     * 抽奖
     */
    drawApi: function () {
      return request({
        url: "https://api.juejin.cn/growth_api/v1/lottery/draw",
        method: "post",
        headers: {
          cookie: getCookie(),
        },
      });
    },
    dipLucky: function (params) {
      return request({
        url: "https://api.juejin.cn/growth_api/v1/lottery_lucky/dip_lucky?aid=2608",
        method: "post",
        data: params,
        headers: {
          cookie: getCookie(),
        },
      });
    },
  };
};
