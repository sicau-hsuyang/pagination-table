/*
 * @Author: JohnYang
 * @Date: 2020-08-23 22:13:41
 * @LastEditors: Do not edit
 * @LastEditTime: 2021-03-25 21:16:17
 */
/**
 * 生成表格的默认配置
 */
export default class DefaultConfig {
  static CreateTableName() {
    return "base-table-" + (Math.random() * 1e10).toFixed(0);
  }

  static CreateDefaultTableColumn() {
    return {
      visible: true,
      label: "字段",
      showOverflowTooltip: true,
      width: undefined,
      minWidth: undefined,
      maxWidth: undefined,
      sortable: false,
      sortMethod: undefined,
      align: "left",
      order: undefined,
      html: undefined,
      formatter: undefined,
      $h: undefined
    };
  }

  static createDefaultTableConfig() {
    return {
      border: true,
      stripe: true,
      selection: true,
      showIndex: true,
      rowKey: "id",
      orderProp: "id",
      direction: "ASC",
      pagination: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        options: [10, 25, 50, 100]
      }
    };
  }

  static EmptyValue = "--";
}
