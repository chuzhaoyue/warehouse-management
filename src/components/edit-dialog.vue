<template>
  <div>
    <el-dialog :title="title" v-loading="loading" style="text-align:left" :width="dialogWidth" :visible.sync="dialogVisible" @close="cancel">
      <!-- <in-or-out :info="info" :isSave="isSave" v-on:saveInfo="onSave"></in-or-out> -->
      <component :is="comp" :info="info"></component>
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
      staff: { comp: Staff, width: '800px' },
      stock: { comp: Stock, width: '450px' },
      in: { comp: InOrOut, width: '400px' },
      out: { comp: InOrOut, width: '400px' }
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
        .then(() => {
          this.$message.success('保存成功!');
          this.loading = false;
          this.close({ state: 'save' });
        });
    }
  }
};
</script>

<style scoped>
</style>