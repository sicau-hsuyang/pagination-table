export default {
  name: 'TableColumnHelper',
  props: {
    render: {
      type: Function,
      required: true
    },
    row: {
      type: Object,
      required: false,
      default: () => ({})
    },
    index: {
      type: Number,
      required: false,
      default: 0
    }
  },
  render(h) {
    return this.render(h, this.row, this.index)
  }
}
