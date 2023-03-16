let configCookie = "";

module.exports = {
  setCookie(value) {
    configCookie = value;
  },
  getCookie() {
    return configCookie;
  },
};
