<template>
    <el-table-column
        v-if="config.visible"
        :prop="prop"
        :label="config.label"
        :show-overflow-tooltip="config.showOverflowTooltip"
        :width="config.width"
        :min-width="config.minWidth"
        :max-width="config.maxWidth"
        :sort-method="config.sortMethod"
        :sortable="config.sortable"
        :align="config.align"
    >
        <template slot-scope="{ row }">
            <TableColumnHelper
                v-if="typeof config.render === 'function'"
                :h="column.render"
                :row="row"
            ></TableColumnHelper>
            <div
                v-else-if="typeof config.html === 'function'"
                v-html="config.html(row[prop], row)"
            >
            </div>
            <span v-else>
                {{ typeof config.formatter === 'function' ? renderContent(config.formatter(row[prop], row)) : renderContent(row[prop], row) }}
            </span>
        </template>
    </el-table-column>
</template>

<script lang="ts">
import TableColumnHelper from "./table-column-helper";
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { TableColumn } from 'types';
@Component({
    name: "BaseColumn",
    components: {
        TableColumnHelper
    }
})
export default class BaseColumn extends Vue {

    @Prop({
        required: true,
        type: String
    })
    prop: string;

    @Prop({
        type: Object,
        required: false
    })
    column: TableColumn = {};

    config = this.defaulConfig();

    @Watch("config", {
        deep: true
    })
    handleConfigChange() {
        Object.assign(this.config, this.column);
    }

    created() {
        Object.assign(this.config, this.column || {});
    }

    mounted() {
        this.$emit("loaded", this.prop);
    }

    defaulConfig() {
        return {
            // 是否显示表格字段
            visible: true,
            // String 必填 字段名称
            label: "字段",
            // Boolean 可选
            showOverflowTooltip: false,
            // String|Number|undefined 可选 字段的宽度
            width: undefined,
            // String|Number|undefined 可选 字段的最小宽度
            minWidth: undefined,
            // String|Number|undefined 可选 字段的最大宽度
            maxWidth: undefined,
            // String|Function 可选 字段排序方式
            sortable: undefined,
            // Function 可选 字段自定义排序方式
            sortMethod: undefined,
            // String 可选 字段对齐形式 默认左对齐
            align: "left",
            // Function 可选 render必须提供，h Vue中render函数的参数h
            // 返回为JSX内容或者render函数的内容形式
            // render(h) {
            //   return (``)
            // },
            // Boolean|Object  可选 字段 是否参与搜索条件 默认false
            // 当Array和 true的时候，代表可以参与表格的搜索
            // 如果是数组，说明表格是selector，则数据的内容
            // 是候选项
            filterable: false,
            // Number  搜索条件的排序 可选
            order: undefined,
            // Function| undefined  可选 将字段的内容渲染成字符串 以html的形式插入
            html: undefined, // (propVal, row) => { return `` }
            // 同html
            formatter: undefined // (propVal, row) => {}
        };
    }

    renderContent(content) {
        return typeof content !== "undefined" ? content : "-";
    }

}
</script>
