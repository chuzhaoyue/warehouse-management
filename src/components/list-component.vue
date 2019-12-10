<template>
  <div>
    <header>
      <el-input :placeholder="`可按${propsInfo.attr}搜索`" prefix-icon="el-icon-search" v-model="query.value" @change="getData()"></el-input>
      <el-button type="primary" icon="el-icon-plus" class="addbtn" plain @click="edit">新增</el-button>
    </header>
    <main>
      <el-table v-loading="loading" height="577px" :row-style="{height:'53px'}" :data="data" :header-cell-style="{background:'#F5F7FA'}" border style="width: 100%">
        <el-table-column type="index" :index="(query.pagination.currentPage - 1) * query.pagination.pageSize + 1">
        </el-table-column>
        <el-table-column v-for="(item, index) in propsInfo.column" :key="index" :prop="item.prop" :label="item.label" :min-width="item.width"></el-table-column>
        <el-table-column label="操作" width="110px">
          <template slot-scope="scope">
            <el-button-group v-show="(propsInfo.page != 'in' && propsInfo.page!='out') || scope.row.editable">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row.id)" plain></el-button>
              <el-button size="mini" type="primary" icon="el-icon-delete" @click="del(scope.row.id)" plain></el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <edit-dialog :page="propsInfo.page" :title="propsInfo.title" :api="propsInfo.api" :info="dialog.info" :isShow="dialog.isShow" @closeDialog="closeDialog"></edit-dialog>
    </main>
    <footer>
      <el-pagination @current-change="handleCurrentChange" :current-page="query.pagination.currentPage" :page-size="query.pagination.pageSize" :total="query.pagination.total" layout="total, prev, pager, next, jumper">
      </el-pagination>
    </footer>
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
      query: {
        value: '',
        pagination: { currentPage: 1, pageSize: 10, total: 0, pageCount: 0 }
      },
      dialog: { info: {}, isShow: false }
    }
  },
  mounted () {
    this.loading = true;
    this.getData();
  },
  methods: {
    getData () {
      this.propsInfo.api.search(this.query)
        .then(res => {
          if (res.data.code == '0') {
            this.data = res.data.data;
            this.query.pagination = res.data.pagination;
            this.loading = false;
          } else {
            this.$message.error('请求失败');
          }
        })
        .catch(() => {
          this.$message.error('请求失败');
        });
    },
    handleCurrentChange (val) {
      this.query.pagination.currentPage = val;
      this.getData();
    },
    edit (id) {
      if (typeof (id) === 'number') {
        this.propsInfo.api.single(id)
          .then((res) => {
            if (res.data.code === '0') {
              this.dialog.info = res.data.data;
            } else {
              this.$message.error('请求失败');
            }
          })
          .catch(() => {
            this.$message.error('请求失败');
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
            .then((res) => {
              if (res.data.code === '0') {
                this.$message.success('删除成功!');
                this.getData();
              } else {
                this.$message.error('请求失败');
              }
            })
            .catch(() => {
              this.$message.error('请求失败');
            });
        }).catch(() => {
          this.$message({ type: 'info', message: '已取消删除' });
        });
    }
  }
};
</script>

<style scoped>
header {
  position: absolute;
  right: 122px;
  top: 13px;
}
.el-input {
  width: 200px;
  margin-right: 20px;
}
footer {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
</style>