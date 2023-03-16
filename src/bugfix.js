const fixApi = require("./api/bugfix")();

// 暂停，避免快速请求以及频繁请求
async function sleep(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

module.exports.bugfix = async function () {
  let arry = await fixApi.getNotCollectBugList();
  console.log(arry);
  for (let i = 0; i < arry.length; i += 1) {
    fixApi
      .collectBug(arry[i])
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
    await sleep(3000);
  }
};
