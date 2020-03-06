<template>
    <div>
        <button @click="handleRefresh">测试刷新</button>
        <BaseTable
            class="pagi-table"
            ref="table"
            name="landscapes"
            :config="config"
            :columns="columns"
        />
    </div>
</template>
<script>
import GeneralExport from "general-export/dist/main.web.js";
export default {
    name: "Home",
    data() {
        var _this = this;
        return {
            config: {
                operation: {
                    render(h, row) {
                        return (
                            <div>
                                <el-button
                                    size="mini"
                                    type="success"
                                    onClick={$event => {
                                        $event.preventDefault();
                                        $event.stopPropagation();
                                        _this.handleMark(row);
                                    }}
                                >
                                    标记
                                </el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    onClick={$event => {
                                        $event.stopPropagation();
                                        $event.preventDefault();
                                        _this.handleDel(row);
                                    }}
                                >
                                    删除
                                </el-button>
                            </div>
                        );
                    }
                },
                defaultSort: { prop: "createTime", order: "descending" },
                serverSort: false,
                showSearchbox: true,
                showCheckbox: true,
                fetchTableData: this.loadData
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
                    sortable: true,
                    formatter(createTime) {
                        return _this.formateDate(createTime);
                    }
                }
            }
        };
    },
    methods: {
        export2File() {
            let tableData = this.$refs.table.getTableData(false);
            console.log(tableData);
            GeneralExport("数据.xlsx", tableData);
        },
        async loadData({ pageSize, pageNum, name, ticket }, sortpParams) {
            let res = await this.$http.get("/api/data", {
                params: {
                    pageSize,
                    pageNum,
                    name,
                    ticket,
                    ...sortpParams
                }
            });
            return res.data;
        },
        handleRefresh() {
            this.$refs.table && this.$refs.table.reload(true)
        },
        handleDel(row) {
            alert(row);
        },
        formateDate(timestamp) {
            let time = new Date(timestamp);
            let year = time.getFullYear();
            let month = time.getMonth() + 1;
            let date = time.getDate();
            return year + "年" + month + "月" + date + "日";
        }
    }
};
</script>

<style lang="scss">
.pagi-table {
    .link {
        color: violet !important;
    }
}
</style>
