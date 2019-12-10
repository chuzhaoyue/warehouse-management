<template>
  <div>
    <list-component :propsInfo="propsInfo"></list-component>
  </div>
</template>

<script>
import StaffApi from '../../api/basic/staff.api.js'
import ListComponent from '../../components/list-component'

export default {
  name: 'staff',
  components: {
    ListComponent
  },
  data () {
    return {
      propsInfo: {
        attr: '姓名',
        page: 'staff',
        title: '员工信息编辑',
        api: StaffApi,
        column: [
          { prop: 'name', label: '姓名', width: '70px' },
          { prop: 'sex', label: '性别', width: '50px' },
          { prop: 'phone', label: '手机号', width: '115px' },
          { prop: 'email', label: '邮箱', width: '200px' }
        ]
      }
    }
  },
  mounted () { },
  methods: {}
};
</script>

<style scoped>
</style>