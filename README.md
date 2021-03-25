# 基于 ElementUI-Table 构建的可分页搜索表格

表格列通过使用配置呈现不同的功能，可支持自定义列、v-html、formatter 等功能，表格具备分页功能，可以通过配置开关该功能。
![无法加载图片](https://raw.githubusercontent.com/Sicau-HsuYang/pagination-table/master/src/assets/table-demo.png "图片title")

## 开始使用

## 1、使用 webpack 构建。

请确保在使用该组件之前，项目已正确配置 Element-UI

### 安装插件

```bash
npm install pagination-table —S
```

### 注册插件

```js
import TablePagination from "pagination-table";
Vue.use(TablePagination);
```

### 基本使用

```vue
<template>
  <base-table
    ref="table"
    :config="tableConfig"
    :columns="tableColumns"
  ></base-table>
</template>
<script>
export default {
  name: "Table",
  data() {
    return {
      tableConfig: {
        getData: this.loadData
      },
      tableColumns: {
        name: {
          label: "姓名"
        },
        age: {
          label: "年纪"
        }
      }
    };
  },
  methods: {
    loadData(queryParams, sortParams) {
      // 必须返回数组
      // 如果不用分页 只需要返回数组即可
      // 如果启用分页 需要返回数据和总条数 例如：{ data: [],total: 0 }
      return [];
    },
    /** 手动刷新表格
     * @params {Boolean} back2first 是否回到首页
     */
    reloadTable(back2first) {
      this.$refs.table && this.$refs.table.reload(back2first);
    }
  }
};
</script>
```

## 2、直接使用

由于直接在页面中使用缺少构建工具的支持，因此在 render 函数中无法使用 jsx。render 函数的详细用法请参考：[跳转门](https://cn.vuejs.org/v2/guide/render-function.html#createElement-%E5%8F%82%E6%95%B0 "render函数参数")

```html
<div id="app">
  <base-table
    class="pagi-table"
    ref="table"
    name="landscapes"
    :config="config"
    :columns="columns"
  />
</div>
<!--
 pagitaion table dependencies vue.js & element-ui.js
-->
<script src="https://cdn.bootcss.com/vue/2.6.11/vue.js"></script>
<script src="https://cdn.bootcss.com/axios/0.19.2/axios.js"></script>
<script src="https://cdn.bootcss.com/element-ui/2.13.0/index.js"></script>
<script src="./libs/main.js"></script>
<script>
  Vue.use(PaginationTable, {
    name: "BaseTable"
  });

  new Vue({
    el: "#app",
    data() {
      var _this = this;
      return {
        config: {
          operation: {
            //直接饮用，render函数无法使用jsx
            render(h, row) {
              return h("div", [
                h("el-button", {
                  props: {
                    size: "mini",
                    type: "success"
                  },
                  domProps: {
                    innerText: "标记"
                  },
                  on: {
                    click: $event => {
                      $event.preventDefault();
                      $event.stopPropagation();
                      _this.handleMark(row);
                    }
                  }
                }),
                h("el-button", {
                  props: {
                    size: "mini",
                    type: "danger"
                  },
                  on: {
                    click: $event => {
                      $event.stopPropagation();
                      $event.preventDefault();
                      _this.handleDel(row);
                    }
                  },
                  domProps: {
                    innerText: "删除"
                  }
                })
              ]);
            }
          },
          defaultSort: { prop: "createTime", order: "descending" },
          serverSort: false,
          showSearchbox: true,
          showCheckbox: true,
          fetchTableData: this.loadData,
          columnConfigurable: true
        },
        columns: {
          id: {
            label: "景点编号"
          },
          name: {
            label: "景点",
            filterable: true,
            html(name, row) {
              return `<a class="link" href=${row.url} target="_blank">${name}</a>`;
            }
          },
          location: {
            label: "所在位置"
          },
          ticket: {
            label: "是否需要门票",
            filterable: {
              order: 2,
              options: [
                {
                  label: "是",
                  value: 1
                },
                {
                  label: "否",
                  value: 2
                }
              ]
            },
            formatter(ticket) {
              return ticket ? "是" : "否";
            }
          },
          price: {
            label: "价格",
            formatter(price) {
              return typeof price === "number" && !Number.isNaN(price)
                ? "￥" + price
                : "-";
            }
          },
          createTime: {
            label: "创建时间",
            sortable: true
          }
        }
      };
    },
    methods: {
      async loadData({ pageSize, pageNum, name, ticket }, sortpParams) {
        let res = await axios.get("/api/data", {
          params: { pageSize, pageNum, name, ticket, ...sortpParams }
        });
        return res.data;
      },
      handleDel(row) {
        console.log(row);
      },
      handleMark(row) {
        console.log(row);
      }
    }
  });
</script>
```

#### 表格参数介绍

表格仅提供 config 和 columns 两个参数，但是内部支持支持 Element-UI Table 的一切 Prop 穿透

| 参数    |   参数介绍 | 是否必选 |     类型     | 默认值 |
| ------- | ---------: | :------: | :----------: | ------ |
| config  |   表格配置 |    是    | TableConfig  | 无     |
| columns | 表格列配置 |    是    | TableCloumns | 无     |

#### TableConfig

| 参数           |                     参数介绍 | 是否必选 |                    类型                    | 默认值     |
| -------------- | ---------------------------: | :------: | :----------------------------------------: | ---------- |
| getData        |                 获取表格数据 |    是    | 返回类型为 TableDataType（后有介绍）的函数 | 无         |
| lazyLoad       | 是否在表格加载完成就拉取数据 |    否    |                  boolean                   | false      |
| serverSort     |           是否启用服务器排序 |    否    |                  boolean                   | false      |
| pagination     |                     分页参数 |    否    |             boolean 或 Object              | Pagination |
| showIndex      |               是否显示序号列 |    否    |             boolean 或 Object              | false      |
| selection      |               是否显示选择列 |    否    |                  boolean                   | false      |
| orderDirection |                     排序顺序 |    否    |                   String                   | "ASC"      |
| orderProp      |                 排序字段名称 |    否    |                   String                   | "id"       |

#### 表格列参数

```typescript
interface TableCloumns {
  [prop: string]: TableColumnConfig;
}
```

#### TableColumnConfig

| 参数                                        |                               参数介绍 | 是否必选 |   类型   | 默认值 |
| ------------------------------------------- | -------------------------------------: | :------: | :------: | ------ |
| 支持 ElementUI TableColumn 一切的表格列属性 |                                     -- |    --    |    --    | --     |
| html                                        | 返回以 v-html 渲染表格单元格内容的函数 |    否    | Function | 无     |
| formatter                                   |   返回以字符串渲染表格单元格内容的函数 |    否    | Function | 无     |
| render                                      |  返回以 VNode 渲染表格单元格内容的函数 |    否    | Function | 无     |

#### 表格方法

表格支持 Element-UI Table 的一切方法，除此之外还支持以下额外的方法：
| 方法名 | 说明 | 参数
| reload | 手动重新加载表格 | back2first: boolean
| navTo | 将表格设置到指定的分页状态并重新加载表格| { pageSize, pageNum }

#### 表格插槽

表格支持任意插槽，只需要指定插槽对应名称的 table prop 名，表格将会自动将其插入到对应列的渲染内容区

例如:

```vue
<template>
  <base-table :config="config" :columns="columns">
    <template slot-scope="{ row }" slot="name">
      <span>我将自定义name列, 内容是{{ row.name }}</span>
    </template>
    <template slot-scope="{ row }" slot="age">
      <span>我将自定义age列, 内容是{{ row.age }}</span>
    </template>
  </base-table>
</template>
<script>
export default {
  name: "TableDemo",
  data() {
    return {
      config: {
        getData: []
      },
      columns: {
        name: {
          label: "姓名"
        },
        age: {
          label: "年龄"
        }
      }
    };
  }
};
</script>
```

#### 函数返回类型

```ts
type TableDataType = any[] | { total: number data: any[] } | Promise<anyp[]> | Promise<{ total: number data: any[] }>;
```

##### 默认分页参数

```ts
type Pagination = {
  total: 0;
  currentPage: 1;
  pageSize: 10;
  options: [10, 25, 50, 100];
};
```

### 友情链接

[如何让你的项目支持 JSX](https://github.com/vuejs/jsx#installation "如何让你的项目支持JSX")
