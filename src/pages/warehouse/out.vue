<template>
  <div>
    <list-component :propsInfo="propsInfo"></list-component>
  </div>
</template>

<script>
import OutApi from '../../api/warehouse/out.api.js'
import ListComponent from '../../components/list-component'

export default {
  name: 'out',
  components: {
    ListComponent
  },
  data () {
    return {
      propsInfo: {
        attr: '食品名称',
        page: 'out',
        title: '出库信息编辑',
        api: OutApi,
        column: [
          { prop: 'foodName', label: '食品名称', width: null },
          { prop: 'quantity', label: '数量', width: null },
          { prop: 'brand', label: '厂家', width: null },
          { prop: 'operatorName', label: '操作人', width: null }
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