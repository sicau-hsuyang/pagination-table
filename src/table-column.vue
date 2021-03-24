<script lang="jsx">
  /** eslint-disable */
  import Vue from 'vue'
  import { Component, Prop, Watch } from 'vue-property-decorator'
  import DefaultConfig from './default-config'
  import TableColumnWrapper from './table-column-wrapper.vue'
  @Component({
    name: 'TableColumn',
    components: {
      TableColumnWrapper,
    },
  })
  export default class TableColumn extends Vue {
    @Prop({
      type: String,
      required: true,
    })
    prop

    @Prop({
      type: Object,
      required: false,
    })
    scopedSlots

    @Prop({
      type: Object,
      required: true,
    })
    column

    @Prop({
      required: false,
      type: Number,
      default: 0,
    })
    level

    config = DefaultConfig.CreateDefaultTableColumn()

    defaultConfig = DefaultConfig.CreateDefaultTableColumn()

    @Watch('column', {
      deep: true,
    })
    onColumnChange() {
      this.config = Object.assign({}, this.config, this.column || {})
      this.level == 0 && this.mergeDefault(this.config.columns)
    }

    created() {
      this.config = Object.assign({}, this.config, this.column || {})
      this.level == 0 && this.mergeDefault(this.config.columns)
    }

    mergeDefault(columns) {
      if (Array.isArray(columns)) {
        columns.forEach((column) => {
          var updateColumn = Object.assign({}, this.defaultConfig, column || {})
          Object.assign(column, updateColumn)
          if (Array.isArray(column.columns)) {
            this.mergeDefault(column.columns)
          }
        })
      } else if (columns && typeof columns == 'object') {
        Object.values(columns).forEach((column) => {
          var updateColumn = Object.assign({}, this.defaultConfig, column || {})
          Object.assign(column, updateColumn)
          if (column.columns && typeof column.columns == 'object') {
            this.mergeDefault(column.columns)
          }
        })
      }
    }

    mounted() {
      this.$emit('loaded', this.prop)
    }

    createTableChildren(columns) {
      let transformColumns = []
      if (Array.isArray(columns)) {
        transformColumns = columns
      } else {
        transformColumns = Object.entries(columns).map(([prop, value]) => {
          return {
            ...value,
            prop,
          }
        })
      }
      return transformColumns
        .filter((x) => x.visible)
        .map((column, idx) => {
          var slotFunc = this.scopedSlots[column.prop]
          return (
            <table-column
              key={column.prop + '' + idx}
              {...{
                props: {
                  column,
                  level: this.level + 1,
                  prop: column.prop,
                  scopedSlots: this.scopedSlots,
                },
              }}
            >
              {column.columns && this.createTableChildren(column.columns)}
            </table-column>
          )
        })
    }

    setupSlots() {
      var slotFunc = this.scopedSlots[this.prop]
      return {
        default: ({ row, $index }) => {
          return typeof slotFunc === 'function' ? (
            slotFunc({ row, $index })
          ) : (
            <table-column-wrapper
              prop={this.prop}
              row={row}
              index={$index}
              config={this.config}
            />
          )
        },
      }
    }

    // eslint-disable-next-line no-unused-vars
    render(h) {
      var props = {
        attrs: { ...this.config },
        props: { ...this.config },
      }
      var children = []
      if (this.config.columns) {
        children = this.createTableChildren(this.config.columns)
      } else {
        props.scopedSlots = this.setupSlots()
      }
      return (
        this.config.visible && (
          <el-table-column {...props}>{children}</el-table-column>
        )
      )
    }
  }
</script>
