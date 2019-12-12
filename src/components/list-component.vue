<template>
  <div class="wrapper ele_fontsize_9">
    <header class="ele_input">
      <el-input :placeholder="`可按${propsInfo.attr}搜索`" v-model="query.value" @change="getData()"></el-input>
      <el-button type="primary" class="addbtn" plain @click="edit">新增</el-button>
    </header>
    <main>
      <el-table v-loading="loading" :header-row-style="{height:'1rem'}" :header-cell-style="{'padding-top':'0.5rem','padding-bottom':'0.5rem',background:'#F5F7FA'}" :row-style="{height:'1rem'}" :cell-style="{'padding-top':'0.5rem','padding-bottom':'0.5rem'}" :data="data" border style="width: 100%">
        <el-table-column type="index" :index="(query.pagination.currentPage - 1) * query.pagination.pageSize + 1">
        </el-table-column>
        <el-table-column v-for="(item, index) in propsInfo.column" :key="index" :prop="item.prop" :label="item.label" :min-width="item.width"></el-table-column>
        <el-table-column label="操作" min-width="110px">
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
      <div class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.pagination.currentPage" :page-sizes="[5, 10, 15]" :page-size="query.pagination.pageSize" :total="query.pagination.total" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>
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
    handleSizeChange (val) {
      this.query.pagination.pageSize = val;
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
.wrapper {
  height: 100%;
}
.wrapper > header {
  position: absolute;
  right: 10rem;
  top: 0.5rem;
}
.wrapper > main {
  height: 90%;
  overflow: auto;
}
.wrapper > header > .el-input {
  width: 12rem;
  margin-right: 20px;
}
.wrapper > header > .el-button {
  width: 4rem;
  height: 2rem;
  line-height: 2rem;
  padding: 0;
}
.el-table {
  font-size: 0.9rem;
}
.wrapper > footer {
  height: 10%;
  position: relative;
}
.pagination {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 1rem;
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
</style>