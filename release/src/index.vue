<template>
    <div class="base-table">
        <column-ctrl-dialog
            ref="dialog"
            @submit="confirmConfig"
            v-if="meta.columnConfigurable"
            :columns="columns"
        ></column-ctrl-dialog>
        <template v-if="meta.showSearchbox">
            <search-toolbox
                ref="search"
                :config="{ columnConfigurable: meta.columnConfigurable }"
                :columns="columns"
                @table-setting="tableSetting"
                @query="handleQuery"
            />
            <div class="divider"></div>
        </template>
        <slot name="toolbox"></slot>
        <el-table
            ref="table"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            :highlight-current-row="meta.highLightCurrentRow"
            :row-key="meta.rowKey"
            :stripe="meta.stripe"
            :span-method="meta.spanMethod"
            :height="meta.height"
            :show-header="meta.showHeader"
            :default-sort="meta.defaultSort"
            :tree-props="meta.treeProps"
            :border="meta.border"
            :data="tableList"
            @sort-change="handleSortChange"
            @selection-change="handleSelectionChange"
        >
            <el-table-column
                v-if="meta.showCheckbox"
                width="40"
                type="selection"
            ></el-table-column>
            <base-column
                @loaded="handleColumnMounted"
                v-for="(column,prop) in columns"
                :key="prop"
                :column="column"
                :prop="prop"
            ></base-column>
            <el-table-column
                v-if="meta.operation"
                label="操作"
            >
                <template slot-scope="{ row, index }">
                    <table-column-helper
                        :render="meta.operation.render"
                        :row="row"
                        :index="index"
                    ></table-column-helper>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-if="meta.showPagination"
            class="pagination-wrapper"
            :current-page="currentPage"
            :page-sizes="meta.pageSizeOptions"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            prev-text="上一页"
            next-text="下一页"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>

</template>

<script>
import {deepClone} from "./utils";
const NAMESPACE = "PaginationTable";
import ColumnCtrlDialog from "./column-ctrl-dialog";
import TableColumnHelper from "./table-column-helper";
import BaseColumn from "./table-column.vue";
import SearchToolbox from "./search-toolbox.vue";
export default {
    components: {
        ColumnCtrlDialog,
        TableColumnHelper,
        BaseColumn,
        SearchToolbox
    },
    props: {
        columns: {
            type: Object,
            required: true
        },
        config: {
            type: Object,
            required: false,
            default: () => ({})
        },
        name: {
            type: String,
            required: false,
            default: ""
        }
    },
    data() {
        const meta = this.defaultConfig();
        return {
            loading: false,
            queryParams: {},
            meta,
            total: 0,
            currentPage: 1,
            pageSize: 10,
            tableList: []
        };
    },
    created() {
        this.updateConfig(true);
        Object.entries(this.columns).forEach(([prop, column]) => {
            //如果启动了服务器排序 此时需要排序的表格字段便失去了客户端排序的能力
            this.meta.serverSort &&
                column.sortable &&
                (column.sortable = "custom");
            column.prop = prop;
            // 由于此时需要在上面展示 因此 需要用$set
            let visibleConfig = {};
            if (this.name) {
                try {
                    visibleConfig = JSON.parse(localStorage.getItem(`${NAMESPACE}/${this.name}`)) || {};
                } catch (ex) {
                    visibleConfig = {};
                }
            }
            this.$set(
                column,
                "visible",
                //如果缓存里面有 就读取缓存内容 否则读取配置内容
                typeof visibleConfig[column.prop] !== "undefined"
                    ? visibleConfig[column.prop]
                    : typeof column.visible !== "undefined"
                    ? column.visible
                    : true
            );
        });
    },
    mounted() {
        if (!this.meta.lazyLoad) {
            this.meta.serverSort && (this.preventTableSort = true);
            this.loadData(this.queryParams);
        }
    },
    methods: {
        updateConfig() {
            Object.assign(this.meta, this.config);
            Object.assign(this, this.meta.paginationInfo);
            if (
                this.meta.showCheckbox &&
                typeof this.meta.spanMethod === "function"
            ) {
                console.warn(
                    "当合并行和checkbox同时作用时，表格的合并行不准确，请修改您的配置"
                );
            }
        },
        defaultConfig() {
            return {
                // 可选 初始化时，是否不立即加载数据 默认false
                lazyLoad: false,
                // 可选 是否展示表头 默认true
                showHeader: true,
                // 可选 表格的高度
                height: undefined,
                // 可选 显示checkbox
                showCheckbox: false,
                // 可选 是否显示搜索条件
                showSearchbox: false,
                // 可选 是否显示操作列
                operation: false,
                // 可选 是否显示表格的边框
                border: true,
                // 可选 是否显示波浪纹
                stripe: true,
                // 可选 是否显示分页
                showPagination: true,
                // 可选 默认的分页信息
                paginationInfo: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                pageSizeOptions: [10, 20, 30, 50],
                // 可选 是否高亮当前行
                highLightCurrentRow: false,
                // 可选 默认是 `id`
                rowKey: "id",
                // 树形表格树形 可选
                treeProps: { children: "children", hasChildren: "hasChildren" },
                // 排序方式 可选
                defaultSort: { prop: "createDate", order: "descending" },
                // tooltip的主题 可选 默认 dark
                tooltipEffect: "dark",
                // 必须 获取表格的数据的方法
                fetchTableData: () => {
                    // 返回一个Array<T> 或者 返回Promise<Array<T>> 或者返回分页数据和数组的 或者 Promise包裹的这个类型
                    // { total: 0, data: [] }
                    this.loading = false;
                    // eslint-disable-next-line no-throw-literal
                    throw "the [fetch-tble-data] must be implemented";
                },
                // 合并行的方法
                spanMethod: null,
                // 是否启用服务器排序
                serverSort: false,
                // 启用服务器排序后，排序顺序需要发送给什么样的key给服务器
                orderDirection: "direction",
                // 启用服务器排序后，需要对什么字段进行排序
                orderField: "orderField",
                // 启用服务器排序后 降序和升序的规则
                serverSortOrderMapping(direction) {
                    return direction === null
                        ? null
                        : direction === "ascending"
                        ? "ASC"
                        : "DESC";
                },
                columnConfigurable: true
            };
        },
        tableSetting() {
            this.$refs.dialog && this.$refs.dialog.showDialog();
        },
        initTable() {
            this.queryParams = {};
            this.$refs.search && this.$refs.search.initialize();
            if (this.$refs.table) {
                this.$refs.table.clearSelection();
                this.$refs.table.clearSort();
            }
            this.pageSize = this.meta.paginationInfo.pageSize || 10;
            this.currentPage = 1;
            this.tableList = [];
            this.total = 0;
        },
        handleQuery(params) {
            this.queryParams = params;
            this.reload(true);
        },
        back2First() {
            this.currentPage = 1;
        },
        back2Default() {
            this.currentPage = 1;
            this.pageSize = 10;
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.currentPage = 1;
            // 由于采用了服务端排序之后 需要先让表格展示一个排序的形态
            // 需要手动调用排序方法，但是会触发表格的排序处理事件，引发重复请求
            // 需要阻挡掉对table - sort之后的重复的请求
            this.meta.serverSort && (this.preventTableSort = true);
            this.loadData(this.queryParams);
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.meta.serverSort && (this.preventTableSort = true);
            this.loadData(this.queryParams);
        },
        navTo({pageSize, pageNum} = { pageSize: 10, pageNum: 1 }) {
            if(!this.meta.showPagination) {
                console.warn("you haven`t enable the pagination function, this method will not run");
                return;
            }
            if(Number.parseInt(pageNum) != pageNum || !this.meta.pageSizeOptions.includes(+pageSize)) {
                console.error("pagination paramerter is not correct, please check your input!");
                return;
            }
            this.currentPage = +pageNum;
            this.pageSize = +pageSize;
            this.reload(false);
        },
        reload(back2first) {
            this.meta.showPagination && back2first && this.back2First();
            this.meta.serverSort && (this.preventTableSort = true);
            this.loadData(this.queryParams);
        },
        handleColumnMounted(prop) {
            if (this.meta.defaultSort.prop === prop) {
                //todo
                this.sort();
            }
        },
        loadData(queryParams, nextSort = true) {
            if (typeof this.meta.fetchTableData !== "function") {
                // eslint-disable-next-line no-throw-literal
                throw "ths fetchTableData must be required and accept a function or asynchronous-function `<base-table>`";
            }
            this.loading = true;
            const distParams = this.meta.showPagination
                ? {
                      pageNum: this.currentPage,
                      pageSize: this.pageSize,
                      ...queryParams
                  }
                : queryParams;
            const sortParams = {
                [this.meta.orderField]: this.meta.defaultSort.prop,
                [this.meta.orderDirection]: this.meta.serverSortOrderMapping(
                    this.meta.defaultSort.order
                )
            };
            const fetchData =
                typeof this.meta.fetchTableData === "function" &&
                this.meta.fetchTableData(
                    distParams,
                    this.meta.serverSort &&
                        this.columns[sortParams[this.meta.orderField]]
                        ? sortParams
                        : {}
                );
            if (fetchData && typeof fetchData.then === "function") {
                fetchData
                    .then(resp => {
                        this.afterRequestEnd(resp, nextSort);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => {
                        this.loading = false;
                    });
            } else {
                this.afterRequestEnd(fetchData, nextSort);
                this.loading = false;
            }
        },
        afterRequestEnd(resp, shouldSort) {
            // 由于表格是滞后渲染的，第一次渲染完成的时候需要手动执行一次排序
            // 如果启用了服务端排序的话，当加载完成数据之后就不应该再进行这一次的排序了
            if (!resp) {
                // eslint-disable-next-line no-throw-literal
                throw "the function must return some data";
            }
            if (Array.isArray(resp)) {
                this.tableList = resp;
            } else {
                const { total, data } = resp;
                this.tableList = data;
                this.total = total;
            }
            shouldSort && this.clearSort();
            this.clearSelection();
            // 每次表格刷新完成的时候 对外界通知事件
            this.$nextTick(() => {
                // 当指定了当前表格有的排序字段才可以排
                shouldSort && this.sort();
                // 因为sort可以有默认的排序 但是 checked 没有
                // 因此 此刻将toggleSelection的实现交给外部
                this.$emit("loaded", resp);
            });
        },
        clearSort() {
            this.$refs.table && this.$refs.table.clearSort();
        },
        clearSelection() {
            this.$refs.table && this.$refs.table.clearSelection();
        },
        sort() {
            const defaultSort = this.meta.defaultSort;
            this.$refs.table &&
                this.$refs.table.sort(defaultSort.prop, defaultSort.order);
        },
        handleSelectionChange(selection) {
            this.$emit("selection-change", selection);
        },
        handleSortChange(sortParams) {
            if (this.preventTableSort) {
                // 阻挡掉一次重复的刷新 然后立即归位
                this.preventTableSort = false;
                return;
            }
            // 覆盖之前默认的排序方式
            Object.assign(this.meta.defaultSort, sortParams);
            if (this.meta.serverSort) {
                // 加载完成之后 表格不应该再进行排序
                // 服务端排序之后应该回到首页
                this.back2First();
                this.loadData(this.queryParams, false);
                this.$emit("sort-change", sortParams);
            }
        },
        /**
         * @param {String} prop 用什么Prop去决定表格选中还是不选中
         */
        toggleRowSelection(prop) {
            if (!this.$refs.table) {
                return;
            }
            this.tableList.forEach(row => {
                this.$refs.table.toggleRowSelection(row, row[prop]);
            });
        },
        confirmConfig(columns) {
            Object.entries(columns).forEach(([prop, value]) => {
                this.columns[prop].visible = value.visible;
            });
            if (!this.name) {
                console.error(
                    "The configuration of the table column will not take effect if you do not configure [name]"
                );
            } else {
                let persisitKey = `${NAMESPACE}/${this.name}`;
                let visiblity = {};
                Object.entries(columns).map(([prop, value]) => {
                    visiblity[prop] = value.visible;
                });
                localStorage.setItem(persisitKey, JSON.stringify(visiblity));
            }
        },
        _getTransformData(list) {
            return list.map(item => {
                Object.entries(item).map(([prop, value]) => {
                    this.columns[prop] &&
                        typeof this.columns[prop].formatter === "function" &&
                        (item[prop] = this.columns[prop].formatter(
                            value,
                            item
                        ));
                });
                return item;
            });
        },
        /**
         * 获取表格的数据
         * @param {Boolean} raw 是否是纯数据
         */
        getTableData(raw = true) {
            //todo 目前还没有处理分页的情况
            let outputList = this.tableList.map(item => deepClone(item)) ;
            return raw ? outputList : this._getTransformData(outputList);
        }
    }
};
</script>

<style lang="scss" scoped>
.base-table {
    overflow: auto;
}

.divider {
    border-bottom: 1px solid #e5e5e5;
    margin: 20px 0;
}

.pagination-wrapper {
    margin-top: 10px;
}
</style>
