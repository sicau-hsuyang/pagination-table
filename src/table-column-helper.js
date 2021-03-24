/*
 * @Author: JohnYang
 * @Date: 2020-09-22 20:57:03
 * @LastEditors: JohnYang
 * @LastEditTime: 2020-10-20 09:47:25
 */
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
@Component({
  name: 'TableColumnHelper',
})
export default class TableColumnHelper extends Vue {
  @Prop({
    type: Function,
    required: true,
  })
  $h

  @Prop({
    type: Object,
    required: false,
    default: () => ({}),
  })
  row

  @Prop({
    type: Number,
    required: false,
    default: 0,
  })
  index

  render(h) {
    return this.$h(h, this.row, this.index)
  }
}
