# 基于ElementUI-Table构建的可分页搜索表格
表格列通过使用配置呈现不同的功能，可支持自定义列、v-html、formatter等功能，表格具备搜索和分页功能，可以通过配置开关该功能。

## Get started
####安装插件
todo（目前暂未发布npm包）
####注册插件
``` js
import TablePagination from 'pagination-table'
Vue.use(TablePagination)
```
####基本使用 
表格需要config和columns两个必选参数
``` html
<template>
  <base-table ref="table" :config="tableConfig"
  :columns="tableColumns"></base-table>
</template>
<script>
  export default {
    name: "Table",
    data() {
      return {
        tableConfig: {
          fetchTableData: this.loadData
        },
        tableColumns: {
          name: {
            label: "姓名"
          },
          age: {
            label: "年纪"
          }
        }
      }
    },
    methods: {
      loadData(quertParams, sortParams){

      }
    }
  }
</script>  
```
参数介绍
``` typescript
class TableConfig {
  
  // 必选 获取表格的数据的方法
  fetchTableData: (queryParams: Object, sortParams:SortParams) => Array<any> = (queryParams, sortParams) => {
      // 返回一个Array<T> 或者 返回Promise<Array<T>> 或者返回分页数据和数组的 或者 Promise包裹的这个类型
      // { total: 0, data: [] }
      this.loading = false;
      // eslint-disable-next-line no-throw-literal
      throw "the [fetch-tble-data] must be implemented";
  };

  // 可选 初始化时，是否不立即加载数据 默认false
  lazyLoad: Boolean = false;

  // 可选 是否展示表头 默认true
  showHeader: Boolean = true;
  
  // 可选 表格的高度
  height: undefined;

  // 可选 是否显示checkbox
  showCheckbox: Boolean = false;
  
  // ** 可选 是否显示搜索条件
  // 当指定了该项以后，表格列配置的搜索条件才会显示
  showSearchbox: Boolean = false;

  // 可选 是否显示操作列
  showOperation: Boolean = false
  
  // 可选 是否显示表格的边框
  border: Boolean = true

  // 可选 是否显示波浪纹
  stripe: Boolean = true

  // 可选 是否显示分页
  showPagination: Boolean = true

  // 可选 默认的分页信息
  paginationInfo: PaginationParams = {
      total: 0,
      currentPage: 1,
      pageSize: 10
  };

  // 可选 分页每页显示数据容量数组 
  pageSizeOptions: Array<number> = [10, 20, 30, 50];
  
  // 可选 是否高亮当前行
  highLightCurrentRow: Boolean = false;

  // 可选 默认是 `id`
  // 当使用树形表格的时候 必须指定该项
  rowKey: string  =  "id"；
  
  // 可选 树形表格树形 
  treeProps: Object = { children: "children", hasChildren: "hasChildren" };

  // 可选 排序方式 
  defaultSort: SortParams = { prop: "createDate", order: "descending" };

  // 可选 tooltip的主题  默认 dark
  tooltipEffect: string = "dark"

  // 可选 合并行的方法
  spanMethod: undefined;

  // 可选 是否启用服务器排序
  serverSort: Boolean = false

  // 可选 当启用服务器排序后，排序顺序需要发送给什么样的key给服务器 默认值 direction
  orderDirection: "direction",
  
  // 可选 启用服务器排序后，需要对什么字段进行排序 默认值 orderFiled 
  orderField: "orderField",

  // 启用服务器排序后 降序和升序的规则 默认值 如下
  serverSortOrderMapping: (direction: string) => (null | string) = (direction: string) => {
      return direction === null? null : direction === "ascending" ? "ASC": "DESC";
  }
}
```
表格列可支持的配置
``` ts
class TableColumn {

  // 必选 字段名称 
  label: string = "字段",

  // 可选 是否显示表格字段 默认值 true
  show: Boolean = true;

  // Boolean 可选 默认 false
  showOverflowTooltip: Boolean = false;

  // 可选 字段的宽度
  width: undefined|number|string = undefined;

  // 可选 字段的最小宽度
  minWidth: undefined|number|string = undefined;

  // 可选 字段的最大宽度
  maxWidth: undefined|number|string = undefined;

  // 可选 表格字段是否支持排序
  sortable: undefined|string|Boolen = undefined;

  // 可选 字段自定义排序方式
  sortMethod: undefined:Function = undefined;
  
  // 可选 字段对齐形式 默认左对齐
  align: string|undefined = "left";

  // 可选 render必须提供，h Vue中render函数的参数h
  // 返回为JSX内容或者render函数的内容形式 默认 undefined
  render: undeinfed | (h:VNode) => VueComponent = undefined

  // 可选 将字段的内容渲染成字符串 以v-html的形式插入
  html: undefined | (propVal: Object, row: Object) => string = undefined;
  
  // 可选 渲染格式化之后的字段 
  formatter: undefined | (propVal: Object, row: Object) => string = undefined;
  
  // 可选 字段 是否参与搜索条件 默认 false
  filterable: Boolean|FilterConfig = false;

}
```
搜索条件配置参数
```ts
interface Option {
  // 必选 下拉选项文字
  label: string;

  // 必选 下拉选项对应的值
  value: any;
} 

class FilerConfig {

  // 可选 是否直接将当前组件插入合适的位置 
  // 当指定了
  component: VueComponent|undefined = undefined; 

  // 可选 select框中的下拉选项
  // 当配置了options以后，搜索框为下拉选项框
  options: Array<Option>| undefined = undefined; 

  // 可选 是否支持多选 默认 false
  // 该参数必须和options配合使用
  multi: Boolean = false;

  //  可选 搜索条件的排序（即搜索框排列的先后顺序）
  order: undefined|number = undefined;

}
```
