import Table from './src/index.vue'

const PaginationTable: any = {}

PaginationTable.install = function (Vue, options) {
  let config = options || { name: "PaginationTable" }
  Vue.component(config.name, Table)
}

export default PaginationTable;
