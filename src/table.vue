<template>
  <div class="base-table">
    <!-- 表格的内容区域 -->
    <div class="base-table--body">
      <el-table
        ref="table"
        v-bind="meta"
        v-on="$listeners"
        row-key="id"
        :data="list"
        @sort-change="onSortChange"
        v-loading="loading"
        element-loading-text="加载数据中..."
        element-loading-spinner="el-icon-loading"
      >
        <!-- 是否展示搜索框 -->
        <el-table-column
          v-if="meta.selection"
          align="center"
          type="selection"
        ></el-table-column>
        <!-- 是否展示序号 -->
        <el-table-column
          v-if="showIndex"
          type="index"
          v-bind="{
            align: 'center',
            label: '序号',
            width: '80px',
            ...(meta.showIndex || {})
          }"
        ></el-table-column>
        <table-column
          v-for="(column, prop) in columnsProp"
          :key="'el-table' + prop"
          :column="column"
          :scoped-slots="$scopedSlots"
          :prop="prop"
        />
      </el-table>
    </div>
    <!-- 表格的底部的区域 -->
    <div class="base-table--footer" v-if="meta.pagination">
      <el-pagination
        class="pagination-bar"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="meta.pagination.options"
        :total="total"
        layout="total,sizes,prev, pager,next, jumper"
        @size-change="onPageSizeChange"
        @current-change="onCurrentChange"
        prev-text="上一页"
        next-text="下一页"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Component, Prop, Watch, Provide } from "vue-property-decorator";
import DefaultConfig from "./default-config";
import TableColumn from "./table-column.vue";
@Component({
  name: "BaseTable",
  components: {
    TableColumn
  }
})
export default class Table extends Vue {
  get table() {
    return this.$refs.table;
  }

  get showIndex() {
    return typeof this.meta.showIndex === "object"
      ? this.meta.showIndex.visible
      : !!this.meta.showIndex;
  }

  get pagination() {
    // 如果是对象或者 true的话 显示分页
    return typeof this.meta.pagination === "object" || this.meta.pagination;
  }

  @Provide("table")
  baseTable = this;

  /**
   * 表格组件的列配置
   */
  @Prop({
    type: [Object, Array],
    required: true
  })
  columns;

  columnsProp = {};

  /**
   * 组件的配置
   */
  @Prop({
    type: Object,
    required: true
  })
  config;

  /**
   * 表格组件的名称
   */
  @Prop({
    type: String,
    required: false,
    default: DefaultConfig.CreateTableName()
  })
  name;

  // 组件内部维持的表格配置
  meta = DefaultConfig.createDefaultTableConfig();

  loading = false;

  /**
   * 数据的总量
   */
  total = 0;

  /**
   * 当前页
   */
  currentPage = 1;

  /**
   * 每页显示的数量
   */
  pageSize = 0;

  /**
   * 表格的数据
   */
  list = [];

  getTableData() {
    return this.list;
  }

  @Watch("config", {
    deep: true
  })
  onConfigChange() {
    // 当表格配置变化的时候 需要合并表格的配置
    this.mergeTableConfig();
    //需要重新加载表格
    !this.meta.lazyLoad && this.loadData();
  }

  @Watch("columns", {
    deep: true
  })
  onColumnsChange() {
    // 当表格列配置变化的时候 需要合并表格列的配置
    this.mergeTableColumnsConfig();
  }

  /**
   * 将组件导向到指定的位置
   */
  navTo(
    { pageSize, pageNum } = {
      pageSize: 10,
      pageNum: 1
    }
  ) {
    this.pageSize = pageSize;
    this.currentPage = pageNum;
    this.reload(false);
  }

  /**
   * 回到首页
   */
  backToFirst() {
    this.currentPage = 1;
  }

  backToPage(pageNum) {
    this.navTo({ pageSize: this.pageSize, pageNum });
  }

  backToDefault() {
    if (typeof this.meta.pagination === "boolean") {
      this.pageSize = 10;
    } else {
      this.pageSize = this.meta.pagination.pageSize;
    }
    this.currentPage = 1;
  }

  created() {
    //当组件创建的时候 合并默认配置
    this.mergeTableConfig();
    this.mergeTableColumnsConfig();
    //如果开启了分页的话
    if (this.meta.pagination) {
      //启用默认配置
      this.backToDefault();
      this.total = 0;
    }
  }

  /**
   * 合并外界传入的配置
   */
  mergeTableConfig() {
    this.meta = Object.assign({}, this.meta, this.$attrs, this.config || {});
  }

  /**
   * 合并表格列的配置 为了兼容外部的参数 同时支持Object 和Array两种类型
   */
  mergeTableColumnsConfig() {
    this.columnsProp = {};
    if (Array.isArray(this.columns)) {
      this.columns.forEach(column => {
        var prop = column.prop;
        this.$set(this.columnsProp, prop, {
          ...DefaultConfig.CreateDefaultTableColumn(),
          ...column,
          // 如果开启了服务端分页的话，当前列就不再使用客户端排序
          sortable:
            this.meta.serverSort && column.sortable
              ? "custom"
              : column.sortable,
          prop,
          showOverflowTooltip:
            prop === "operation"
              ? false
              : typeof column.showOverflowTooltip === "undefined"
              ? true
              : column.showOverflowTooltip
        });
      });
    } else if (typeof this.columns === "object" && this.columns) {
      Object.entries(this.columns || {}).forEach(([prop, column]) => {
        this.$set(this.columnsProp, prop, {
          ...DefaultConfig.CreateDefaultTableColumn(),
          ...column,
          // 如果开启了服务端分页的话，当前列就不再使用客户端排序
          sortable:
            this.meta.serverSort && column.sortable
              ? "custom"
              : column.sortable,
          prop,
          showOverflowTooltip:
            prop === "operation"
              ? false
              : typeof column.showOverflowTooltip === "undefined"
              ? true
              : column.showOverflowTooltip
        });
      });
    }
  }

  mounted() {
    // 如果立即加载的话 当表格渲染完成的时候 不需要立即加载
    !this.meta.lazyLoad && this.loadData();
  }

  onSortChange(sortParams) {
    let { serverSort } = this.meta;
    if (serverSort) {
      Object.assign(this.meta, {
        orderProp: sortParams.prop,
        orderDirection: sortParams.order
      });
      this.loadData();
    }
  }

  onPageSizeChange(val) {
    if (!this.meta.pagination) {
      return;
    }
    this.pageSize = val;
    this.currentPage = 1;
    this.loadData();
  }

  onCurrentChange(val) {
    if (!this.meta.pagination) {
      return;
    }
    this.currentPage = val;
    this.loadData();
  }

  reload(toFirst) {
    if (this.meta.pagination && toFirst) {
      this.backToFirst();
    }
    this.loadData();
  }

  async loadData() {
    let {
      getData,
      pagination,
      sortOrderMapping,
      orderProp,
      orderDirection
    } = this.meta;
    let distParams = Object.assign(
      {},
      {
        sortParams: {
          orderProp
        }
      }
    );
    if (pagination) {
      Object.assign(distParams, {
        pageSize: this.pageSize,
        pageNum: this.currentPage
      });
    }
    if (typeof sortOrderMapping === "function") {
      Object.assign(distParams, {
        sortParams: {
          orderProp,
          direction: sortOrderMapping(orderDirection)
        }
      });
    }
    // 如果是外界传入的是函数 由于不管是同步还是异步函数 都可以跟await 所以一律认为是异步函数
    if (typeof getData === "function") {
      this.loading = true;
      try {
        let response = await getData(distParams);
        if (response) {
          this.afterRequestEnd(response);
        }
      } catch (exp) {
        console.log("async error:", exp);
      } finally {
        this.loading = false;
      }
    } else {
      this.afterRequestEnd(getData);
    }
  }

  afterRequestEnd(resp) {
    if (Array.isArray(resp)) {
      // 如果后台直接返回的是数组的话 说明不需要分页
      this.meta.pagination = false;
      this.list = resp;
    } else {
      this.total = resp.total;
      this.list = resp.data;
    }
    this.$emit(
      "request-end",
      this.meta.pagination ? { total: this.total, data: this.list } : this.list
    );
  }

  clearSort() {
    this.table && this.table.clearSort.apply(this, arguments);
  }

  clearFilter() {
    this.table && this.table.clearFilter.apply(this, arguments);
  }

  doLayout() {
    this.table && this.table.doLayout.apply(this, arguments);
  }

  clearSelection() {
    this.table && this.table.clearSelection.apply(this, arguments);
  }

  toggleAllSelection() {
    this.table && this.table.toggleAllSelection.apply(this, arguments);
  }

  toggleRowSelection() {
    this.table && this.table.toggleRowSelection.apply(this, arguments);
  }

  toggleRowExpansion() {
    this.table && this.table.toggleRowExpansion.apply(this, arguments);
  }

  setCurrentRow() {
    this.table && this.table.setCurrentRow.apply(this, arguments);
  }
}
</script>

<style lang="scss" scoped>
.base-table {
  &--footer {
    width: 100%;
    padding: 20px 0;
    float: left;
    @at-root .pagination-bar {
      float: right;
    }
  }
}
</style>
