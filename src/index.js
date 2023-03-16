const config = require("./utils/config.js");
const { setCookie } = require("./utils/setCookie");
/**
 * Created by huangqihong on 2022/01/07 23:35:00
 */

const check = require("./checkIn");
const seagold = require("./seagold");
const bugfix = require("./bugfix");

const cookies = Object.values(config).filter((v) => v);

// 暂停，避免快速请求以及频繁请求
async function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function loop() {
  for (let i = 0; i < cookies.length; i += 1) {
    // 需要设置全局的cookie
    setCookie(cookies[i]);
    await sleep(3000);
    // 签到
    check.junJin();

    seagold.seagold();
    bugfix.bugfix();
    await sleep(30000);
  }
}
loop();
