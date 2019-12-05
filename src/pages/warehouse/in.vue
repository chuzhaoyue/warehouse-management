<template>
  <div>
    <list-component :propsInfo="propsInfo"></list-component>
  </div>
</template>

<script>
import InApi from '../../api/warehouse/in.api.js'
import ListComponent from '../../components/list-component'

export default {
  name: 'in',
  components: {
    ListComponent
  },
  data () {
    return {
      propsInfo: {
        attr: '食品名称',
        page: 'in',
        title: '入库信息编辑',
        api: InApi,
        column: [
          { prop: 'foodName', label: '食品名称', width: null },
          { prop: 'quantity', label: '数量', width: null },
          { prop: 'brand', label: '厂家', width: null },
          { prop: 'operatorName', label: '操作人', width: null },
          { prop: 'time', label: '操作时间', width: null }
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