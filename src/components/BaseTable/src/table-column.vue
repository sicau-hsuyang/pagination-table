<template>
    <el-table-column
        v-if="meta.visible"
        :label="meta.label"
        :width="meta.width"
        :min-width="meta.minWidth"
        :max-width="meta.maxWidth"
        :sortable="meta.sortable"
        :align="meta.align"
        :class-name="meta.className"
        :resizable="
        meta.resizable"
        :prop="prop"
        :show-overflow-tooltip="meta.showOverflowTooltip"
    >
        <template slot-scope="{ row, index }">
            <table-column-helper
                v-if="typeof meta.render === 'function'"
                :render="meta.render"
                :row="row"
                :index="index"
            ></table-column-helper>
            <div
                v-else-if="typeof meta.html === 'function'"
                v-html="meta.html(row[prop], row, index)"
            >
            </div>
            <span v-else>{{ typeof meta.formatter === 'function' ? meta.formatter(row[prop], row, index) : row[prop] }}</span>
        </template>
    </el-table-column>
</template>

<script>
import TableColumnHelper from "./table-column-helper";
export default {
    name: "BaseTableColumn",
    components: {
        TableColumnHelper
    },
    props: {
        prop: {
            type: String,
            required: true
        },
        column: {
            type: Object,
            required: true
        }
    },
    watch: {
        column: {
            handler() {
                Object.assign(this.meta, this.column);
            },
            deep: true
        }
    },
    created() {
        Object.assign(this.meta, this.column);
    },
    data() {
        var meta = this.defaultConfig();
        return {
            meta
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.$emit("loaded", this.prop);
        });
    },
    methods: {
        defaultConfig() {
            return {
                label: "字段",
                html: undefined,
                align: "left",
                visible: true,
                filterable: false,
                render: undefined,
                showOverflowTooltip: false,
                className: "",
                resizable: true,
                formatter: undefined
            };
        }
    }
};
</script>
