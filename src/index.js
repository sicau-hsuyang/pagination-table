/*
 * @Autor: Zhang Yingying
 * @Date: 2021-03-24 23:38:05
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-24 23:40:30
 */
import Table from "./table.vue";

const PaginationTable = {};

PaginationTable.install = function(Vue, options) {
  let config = options || { name: "PaginationTable" };
  Vue.component(config.name, Table);
};

export default PaginationTable;
