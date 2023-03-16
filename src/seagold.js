const miningApi = require("./api/mining")();
const jwt = require("jsonwebtoken");
const firstData = require("./utils/first");
const message = require("./utils/message");
const { getCookie } = require("./utils/setCookie");

module.exports.seagold = async function () {
  const COOKIE = getCookie();
  let juejinUid = "";

  if (!COOKIE) {
    message("获取不到游戏必须得COOKIE，请检查设置");
  } else {
    let tokenObj = await miningApi.getToken().catch((err) => {
      // console.log(err);
    });
    let TOKEN = `Bearer ${tokenObj.data}`;
    let gameId = ""; // 发指令必须得gameId
    let deep = 0;
    let todayDiamond = 0;
    let todayLimitDiamond = 0;
    async function getInfo() {
      const time = new Date().getTime();
      const userInfo = await miningApi.getUser().catch((err) => {
        console.log(err);
      });
      juejinUid = userInfo.user_id;

      const resInfo = await miningApi
        .getInfo(juejinUid, time, TOKEN)
        .catch((err) => {
          console.log(err);
        });

      deep = resInfo.gameInfo ? resInfo.gameInfo.deep : 0;
      gameId = resInfo.gameInfo ? resInfo.gameInfo.gameId : 0;
      todayDiamond = resInfo.userInfo.todayDiamond || 0;
      todayLimitDiamond = resInfo.userInfo.todayLimitDiamond;
      console.log(todayDiamond, todayLimitDiamond);
      return Promise.resolve(resInfo);
    }
    getInfo()
      .then(() => {
        if (todayDiamond < todayLimitDiamond) {
          playGame().then(() => {});
        }
      })
      .catch((err) => {
        console.log(err);
      });

    // 暂停，避免快速请求以及频繁请求
    async function sleep(delay) {
      return new Promise((resolve) => setTimeout(resolve, delay));
    }
    /**
     * 循环游戏
     */
    async function playGame() {
      try {
        // 开始
        const startTime = new Date().getTime();
        const startParams = {
          roleId: 3,
        };
        const startData = await miningApi.start(
          startParams,
          juejinUid,
          startTime,
          TOKEN
        );
        await sleep(3000);
        console.log("startData", startData);
        gameId = startData.gameId;
        // 发起指令
        const commandTime = +new Date().getTime();
        const commandParams = {
          command: firstData.command,
        };
        const xGameId = getXGameId(gameId);
        const commandData = await miningApi.command(
          commandParams,
          juejinUid,
          commandTime,
          xGameId,
          TOKEN
        );
        deep = commandData.curPos.y;
        await sleep(3000);
        console.log("commandData", commandData);
        // 结束
        const overTime = +new Date().getTime();
        const overParams = {
          isButton: 1,
        };
        const overData = await miningApi.over(
          overParams,
          juejinUid,
          overTime,
          TOKEN
        );
        await sleep(3000);
        console.log("overData", overData);
        deep = overData.deep;
        // 更换地图
        const mapTime = +new Date().getTime();
        if (deep < 500) {
          await sleep(3000);
          await miningApi.freshMap({}, juejinUid, mapTime);
        }
        await sleep(3000);
        await getInfo()
          .then((res) => {
            if (todayDiamond < todayLimitDiamond) {
              playGame();
            } else {
              message(
                `今日限制矿石${res.userInfo.todayLimitDiamond},已获取矿石${res.userInfo.todayDiamond}`
              );
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (e) {
        await sleep(3000);
        // 结束
        const overTime = +new Date().getTime();
        const overParams = {
          isButton: 1,
        };
        await miningApi.over(overParams, juejinUid, overTime, TOKEN);
        await sleep(3000);
        await getInfo()
          .then((res) => {
            if (todayDiamond < todayLimitDiamond) {
              playGame();
            } else {
              message(
                `今日限制矿石${res.userInfo.todayLimitDiamond},已获取矿石${res.userInfo.todayDiamond}`
              );
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    function getXGameId(id) {
      const time = +new Date().getTime();
      return jwt.sign(
        {
          gameId: id,
          time: time,
          // eslint-disable-next-line max-len
        },
        "-----BEGIN EC PARAMETERS-----\nBggqhkjOPQMBBw==\n-----END EC PARAMETERS-----\n-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIDB7KMVQd+eeKt7AwDMMUaT7DE3Sl0Mto3LEojnEkRiAoAoGCCqGSM49\nAwEHoUQDQgAEEkViJDU8lYJUenS6IxPlvFJtUCDNF0c/F/cX07KCweC4Q/nOKsoU\nnYJsb4O8lMqNXaI1j16OmXk9CkcQQXbzfg==\n-----END EC PRIVATE KEY-----\n",
        {
          algorithm: "ES256",
          expiresIn: 2592e3,
          header: {
            alg: "ES256",
            typ: "JWT",
          },
        }
      );
    }
  }
};
