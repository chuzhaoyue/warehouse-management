<template>
  <div class="ele_fontsize_9">
    <el-dialog :title="title" v-loading="loading" style="text-align:left" :width="dialogWidth" :visible.sync="dialogVisible" @close="cancel">
      <component :is="comp" :page="page" :info="info"></component>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="onSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InOrOut from './in-or-out'
import Staff from './staff'
import Stock from './stock'

export default {
  name: 'edit-dialog',
  components: { InOrOut, Staff, Stock },
  props: { page: String, title: String, api: Object, info: Object, isShow: Boolean },
  data () {
    return {
      loading: false,
      dialogVisible: this.isShow,
      pages: {},
      comp: null,
      dialogWidth: ''
    }
  },
  watch: {
    // dialog是否可见
    isShow (val) {
      this.dialogVisible = val;
    },
    // 确定form组件
    page (val) {
      this.component = this.pages[val];
    }
  },
  created () {
  },
  mounted () {
    this.$bus.on('save', this.save);
    // form组件，（写在return里显示不出，可能是因为加载慢？）
    this.pages = {
      staff: { comp: Staff, width: '47.4rem' },
      stock: { comp: Stock, width: '26.7rem' },
      in: { comp: InOrOut, width: '23.7rem' },
      out: { comp: InOrOut, width: '23.7rem' }
    };
    this.comp = this.pages[this.page].comp;
    this.dialogWidth = this.pages[this.page].width;
  },
  beforeDestroy () {
    this.$bus.off('save');
  },
  methods: {
    // 关闭
    close (result) {
      this.dialogVisible = false;
      this.$emit('closeDialog', result);
    },
    // 返回
    cancel () {
      this.close({ state: 'cancel' });
    },
    // 保存，提示子组件传递信息
    onSave () {
      this.$bus.emit('readySave');
    },
    // 保存数据
    save (info) {
      this.loading = true;
      this.api.save(info)
        .then((res) => {
          if (res.data.code === '0') {
            this.$message.success('保存成功!');
            this.loading = false;
            this.close({ state: 'save' });
          } else {
            this.$message.error('请求失败');
          }
        })
        .catch(() => {
          this.$message.error('请求失败');
        });
    }
  }
};
</script>

<style scoped>
.el-button{
  width: 4rem;
  height: 2rem;
  line-height: 2rem;
  padding: 0;
}
</style>