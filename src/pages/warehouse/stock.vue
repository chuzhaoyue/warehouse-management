<template>
  <div>
    <list-component :propsInfo="propsInfo"></list-component>
  </div>
</template>

<script>
import StockApi from '../../api/warehouse/stock.api.js'
import ListComponent from '../../components/list-component'

export default {
  name: 'stock',
  components: {
    ListComponent
  },
  data () {
    return {
      propsInfo: {
        attr: '食品名称',
        page: 'stock',
        title: '食品信息编辑',
        api: StockApi,
        column: [
          { prop: 'name', label: '名称', width: '100px' },
          { prop: 'brand', label: '厂家', width: '100px' },
          { prop: 'stock', label: '库存', width: '70px' }
        ]
      }
    }
  },
  mounted () { },
  methods: {}
};
</script>

<style scoped lang="scss">
</style>