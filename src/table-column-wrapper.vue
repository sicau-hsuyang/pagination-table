<!--
 * @Author: JohnYang
 * @Date: 2020-08-24 10:55:45
 * @LastEditors: JohnYang
 * @LastEditTime: 2020-10-27 17:02:48
-->
<script>
  import Vue from 'vue'
  import BaseTableColumnHelper from './table-column-helper'
  import DefaultConfig from './default-config'
  import Component from 'vue-class-component'
  import { Prop } from 'vue-property-decorator'
  @Component({
    name: 'TableColumnWrapper',
    components: {
      BaseTableColumnHelper,
    },
  })
  export default class TableColumnWarapper extends Vue {
    @Prop({
      required: true,
    })
    config

    @Prop({
      required: true,
    })
    prop

    @Prop({
      required: true,
    })
    row

    @Prop({
      required: false,
    })
    index

    renderContent(content) {
      return typeof content !== 'undefined' ? content : DefaultConfig.EmptyValue
    }

    createReadonlyContent(h) {
      if (typeof this.config.render === 'function') {
        return (
          <base-table-column-helper
            row={this.row}
            index={this.index}
            {...{
              props: {
                $h: this.config.render,
              },
            }}
          />
        )
      } else if (typeof this.config.html === 'function') {
        return (
          <div
            {...{
              domProps: {
                innerHTML: this.config.html(
                  this.prop === 'operation' ? this.row : this.row[this.prop],
                  this.row,
                  this.index
                ),
              },
            }}
          ></div>
        )
      } else {
        return (
          <span>
            {typeof this.config.formatter === 'function'
              ? this.renderContent(
                  this.config.formatter(
                    this.prop === 'operation' ? this.row : this.row[this.prop],
                    this.row,
                    this.index
                  )
                )
              : this.renderContent(
                  this.prop === 'operation' ? this.row : this.row[this.prop],
                  this.row,
                  this.index
                )}
          </span>
        )
      }
    }

    render(h) {
      return (
        <div class="table-cell--wrapper">{this.createReadonlyContent(h)}</div>
      )
    }
  }
</script>

<style lang="scss" scoped>
  .table-cell--wrapper {
    display: inline-block;
  }
</style>
