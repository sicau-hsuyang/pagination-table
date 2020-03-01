'use strict';
const path = require('path');
module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1583027306726_5574';

  // add your config here
  config.middleware = [];
  config.static = {
    prefix: '/',
    dir: path.join(appInfo.baseDir, '../fof/FOF'),
  };
  config.security = {
    // 关闭csrf
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ['*'],
  };

  config.bodyParser = {
    jsonLimit: '1024mb',
    formLimit: '128mb',
  };

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };
  return config;
};

