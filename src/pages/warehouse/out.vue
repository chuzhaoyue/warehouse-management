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
          { prop: 'foodName', label: '食品名称', width: '100px' },
          { prop: 'quantity', label: '数量', width: '70px' },
          { prop: 'brand', label: '厂家', width: '100px' },
          { prop: 'operatorName', label: '操作人', width: '70px' },
          { prop: 'time', label: '操作时间', width: '160px' }
        ]
      }
    }
  },
  mounted () { },
  methods: {}
};
</script>

<style scoped>
div {
  height: 100%;
}
</style>