<template>
    <div
        class="search-row"
        :gutter="20"
    >
        <div
            ref="row"
            class="search-row-toolbox"
        >
            <template v-for="(column) in searchs">
                <div
                    :key="column.prop"
                    class="form-ctrl-group"
                >
                    <span class="form-ctrl-lbl">
                        {{ column.label }}:
                    </span>
                    <component
                        :is="column.component"
                        v-if="column.component"
                        v-model="column.value"
                        class="form-ctrl"
                    ></component>
                    <el-select
                        v-else-if="Array.isArray(column.options)"
                        v-model="column.value"
                        :multiple="column.multi"
                        clearable
                        :placeholder="'请选择'+(column.label || '')"
                        class="form-select"
                    >
                        <el-option
                            v-for="(option, optIdx) in column.options"
                            :key="optIdx"
                            :value="option.value"
                            :label="option.label"
                        ></el-option>
                    </el-select>
                    <el-input
                        v-else
                        v-model="column.value"
                        clearable
                        class="form-ctrl"
                        :placeholder="'请输入'+(column.label || '')"
                    ></el-input>
                </div>
            </template>
        </div>
        <div class="search-row-buttons">
            <el-button
                type="primary"
                @click="handleQuery"
            >查询</el-button>
            <el-button @click="handleReset">重置</el-button>
        </div>
    </div>
</template>

<script>
export default {
    name: "SearchToolBox",
    props: {
        columns: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    data() {
        return {
            searchs: []
        };
    },
    created() {
        this.setSearchBox();
    },
    methods: {
        initialize() {
            this.searchs.forEach(search => {
                search.value = Array.isArray(search.value) ? [] : "";
            });
        },
        setSearchBox() {
            this.searchs.clear();
            this.searchs.push(
                ...Object.values(
                    Object.assign(this.defaultConfig(), this.mappingColumn())
                ).orderBy(x => x.order)
            );
        },
        defaultConfig() {
            return {};
        },
        mappingColumn() {
            const mappingObj = {};
            Object.entries(this.columns || {}).forEach(([key, val]) => {
                if (val.filterable && val.label !== "操作") {
                    mappingObj[key] = {
                        prop: key,
                        order: val.order || 1000,
                        label: val.label,
                        value: ""
                    };
                    // 对于 将配置下拉选项的 筛选
                    if (Object.isObject(val.filterable)) {
                        mappingObj[key].component = val.filterable.component;
                        mappingObj[key].options = val.filterable.options;
                        mappingObj[key].multi = val.filterable.multi;
                        val.filterable.multi && (mappingObj[key].value = []);
                    }
                }
            });
            return mappingObj;
        },
        handleQuery() {
            const query = {};
            this.searchs.forEach(search => {
                if (Array.isArray(search.value) && search.value.length) {
                    query[search.prop] = search.value;
                } else if (search.value !== "") {
                    query[search.prop] = search.value;
                }
            });
            this.$emit("query", query);
        },
        handleReset() {
            this.initialize();
            this.$emit("query", {});
        }
    }
};
</script>

<style lang="scss" scoped>
.search-row {
    display: flex;
    margin-bottom: 20px;

    &-toolbox {
        flex: 1;
        overflow: hidden;
    }

    &-buttons {
        text-align: right;
        padding-top: 20px;
        width: 200px;
    }
}

.form-ctrl-group {
    margin-right: 20px;
    float: left;
}

.form-ctrl-lbl {
    font-size: 14px;
    margin-right: 5px;
}

.form-ctrl {
    width: 200px;
    margin-top: 20px;
}

.form-select {
    width: 200px;
    margin-top: 20px;
}
</style>
