<template>
    <el-dialog
        class="cfg-dialog"
        title="配置表格列"
        :visible.sync='visible'
        @open="handleOpen"
        :before-close="handleClose"
    >
        <el-table
            border
            stripe
            :data="data"
        >
            <el-table-column
                prop="label"
                label="表格字段"
            ></el-table-column>
            <el-table-column
                width="140"
                align="center"
                label="操作"
            >
                <template slot-scope="{ row }">
                    <el-switch
                        active-text="显示"
                        inactive-text="隐藏"
                        v-model="row.visible"
                    ></el-switch>
                </template>

            </el-table-column>
        </el-table>
        <div slot="footer">
            <el-button @click="handleClose">关闭</el-button>
            <el-button
                type='primary'
                @click="handleConfirm"
            >确定</el-button>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { TableColumn } from 'types'

@Component({
    name: "ColumnCtrlDialog"
})
export default class ColumnCtrlDialog extends Vue {

    @Prop({
        required: true
    })
    columns: TableColumn = {};

    visible = false;

    data: any = [];

    showDialog() {
        this.visible = true;
    }

    handleConfirm() {
        let columns = {};
        this.data.forEach(column => {
            columns[column.prop] = column;
        });
        this.$emit("submit", columns);
        this.handleClose();
    }

    handleClose() {
        this.visible = false;
    }

    handleOpen() {
        this.data.clear();
        this.data.push(
            ...Object.values(this.columns).map(column => {
                return {
                    label: column.label,
                    prop: column.prop,
                    visible: column.visible
                };
            })
        );
    }
}
</script>

<style scoped>
.cfg-dialog >>> .el-dialog__body {
    padding: 10px 20px !important;
}
</style>
