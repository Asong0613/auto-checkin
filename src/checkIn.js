const { getCookie } = require("./utils/setCookie.js");
const jueJinApi = require("./api/juejin")();
const message = require("./utils/message");

async function junJin() {
  try {
    // 先执行签到、抽奖以及沾喜气
    await jueJinApi.checkIn(); // 抽奖一次
    const drawResult = await jueJinApi.drawApi();
    const dipParams = { lottery_history_id: "7052109119238438925" };
    const dipResult = await jueJinApi.dipLucky(dipParams);
    message(
      `抽奖成功，获得：${drawResult.lottery_name}; 获取幸运点${dipResult.dip_value}, 当前幸运点${dipResult.total_value}`
    );
  } catch (e) {
    message(`有异常，请手动操作,${e.message}`);
  }
}
module.exports.junJin = function checkIn() {
  const COOKIE = getCookie();
  if (!COOKIE) {
    message("获取不到cookie，请检查设置");
  } else {
    // console.log("COOKIE", COOKIE);
    junJin().then(() => {});
  }
};
