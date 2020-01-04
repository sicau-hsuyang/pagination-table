<template>
    <div>
        <PaginationTable
            class="pagi-table"
            ref="table"
            :config="config"
            :columns="columns"
        />
    </div>
</template>

<script>
export default {
    name: "Home",
    data() {
        var _this = this;
        return {
            config: {
                showOperation: {
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
                serverSort: true,
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
        async loadData({ pageSize, pageNum, name, ticket }, sortpParams) {
            // 写死的数据，如需查看实际效果请运行一个合适的服务器程序
            console.log(pageSize, pageNum, name, ticket, sortpParams);
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        total: 100,
                        data: [
                            {
                                id: 1,
                                name: "螺髻山",
                                url:
                                    "https://baike.baidu.com/item/%E8%9E%BA%E9%AB%BB%E5%B1%B1%E9%A3%8E%E6%99%AF%E5%8C%BA/1226258?fr=aladdin",
                                location: "凉山彝族自治州普格县",
                                ticket: true,
                                price: 100,
                                createTime: Date.now()
                            },
                            {
                                id: 2,
                                name: "邛海",
                                url:
                                    "https://baike.baidu.com/item/%E9%82%9B%E6%B5%B7/1247191?fr=aladdin",
                                location: "凉山彝族自治州西昌市",
                                price: 25,
                                ticket: true,
                                createTime: Date.now()
                            },
                            {
                                id: 3,
                                name: "兴隆湖",
                                url:
                                    "https://baike.baidu.com/item/%E5%85%B4%E9%9A%86%E6%B9%96",
                                location: "成都市天府新区兴隆镇",
                                ticket: false,
                                price: null,
                                createTime: Date.now()
                            }
                        ]
                    });
                }, 500);
            });
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
