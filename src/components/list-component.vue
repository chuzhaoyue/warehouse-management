<template>
  <div class="wrapper">
    <el-input :placeholder="`可按${propsInfo.attr}搜索`" prefix-icon="el-icon-search" v-model="query" @change="getData(query)"></el-input>
    <el-button type="primary" icon="el-icon-plus" class="addbtn" plain @click="edit">新增</el-button>
    <el-table v-loading="loading" max-height="550" :data="tableData" :header-cell-style="{background:'#F5F7FA'}" border style="width: 100%">
      <el-table-column sortable v-for="(item, index) in propsInfo.column" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="small" type="primary" icon="el-icon-edit" @click="edit(scope.row.id)" plain></el-button>
            <el-button size="small" type="primary" icon="el-icon-delete" @click="del(scope.row.id)" plain></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <edit-dialog :page="propsInfo.page" :title="propsInfo.title" :api="propsInfo.api" :info="dialog.info" :isShow="dialog.isShow" @closeDialog="closeDialog"></edit-dialog>
  </div>
</template>

<script>
import EditDialog from './edit-dialog'

export default {
  name: 'list-component',
  components: { EditDialog },
  props: { propsInfo: Object },
  data () {
    return {
      loading: false,
      data: [],
      query: '',
      dialog: { info: {}, isShow: false }
    }
  },
  computed: {
    tableData () {
      return this.data.filter(item => !item.isDelete)
    }
  },
  mounted () {
    this.loading = true;
    this.getData();
  },
  methods: {
    getData () {
      this.propsInfo.api.search(this.query)
        .then((res) => {
          this.data = res.data;
          this.loading = false;
        });
    },
    edit (id) {
      if (typeof (id) === 'number') {
        this.propsInfo.api.single(id)
          .then((res) => {
            this.dialog.info = res.data;
          });
      }
      this.dialog.isShow = true;
    },
    closeDialog (result) {
      if (result.state === 'save') {
        this.getData();
      }
      this.dialog.info = {};
      this.dialog.isShow = false;
    },
    del (id) {
      this.$confirm('确定删除?', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' })
        .then(() => {
          this.propsInfo.api.delete(id)
            .then(() => {
              this.$message.success('删除成功!');
              this.getData();
            });
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' });
        });
    }
  }
};
</script>

<style scoped>
.wrapper {
  text-align: right;
}
.el-input {
  width: 200px;
  margin-bottom: 10px;
}
.addbtn {
  margin: 0 101px 10px 10px;
}
</style>