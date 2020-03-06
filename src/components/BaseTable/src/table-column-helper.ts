import { Vue, Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'TableColumnHelper'
})
export default class TableColumnHelper extends Vue {


  @Prop({
    required: true
  })
  h!: Function;

  @Prop({
    required: true,
    default: () => ({})
  })
  row!: object;


  @Prop({
    required: false,
    default: 0
  })
  index!: number;

  render(h) {
    return this.h(h, this.row, this.index)
  }

}
