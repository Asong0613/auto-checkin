/**
 * Created by huangqihong on 2022/01/07 23:35:00
 */
const dotEnv = require('dotenv');
dotEnv.config('./env');

const { COOKIE, TOKEN, setToken } =  require('./utils/config.js');

const miningApi = require('./api/mining')();
const jwt = require('jsonwebtoken');
const firstData = require('./utils/first');













