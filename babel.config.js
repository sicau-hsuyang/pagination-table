/*
 * @Autor: Zhang Yingying
 * @Date: 2020-01-04 12:37:31
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-24 23:45:44
 */
module.exports = {
  presets: ["@babel/preset-env", "@vue/babel-preset-jsx"],
  plugins: [
    [
      "@babel/plugin-proposal-decorators",
      {
        legacy: true
      }
    ],
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-transform-runtime"
  ]
};
