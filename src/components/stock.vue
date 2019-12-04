<template>
  <div>
    <el-form label-suffix=":" :rules="rules" ref="modelInfo" label-width="90px" :model="modelInfo">
      <el-form-item label="食品名称" prop="name">
        <el-input v-model="modelInfo.name"></el-input>
      </el-form-item>
      <el-form-item label="生成厂家" prop="brand">
        <el-input v-model="modelInfo.brand"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'stock',
  props: { info: Object},
  data () {
    return {
      modelInfo: {},
      rules: {
        name: [{ required: true, message: '请输入食品名称', trigger: 'blur' }],
        brand: [{ required: true, message: '请输入生产厂家', trigger: 'blur' }]
      }
    }
  },
  watch: {
    // form信息
    info (val) {
      this.modelInfo = val;
    },
  },
  created () {
    this.$bus.on('readySave', this.readySave);
  },
  mounted () { },
  beforeDestroy(){
    this.$bus.off('readySave');
  },
  methods: {
    // 保存，向父组件传递数据，请父组件调用方法保存
    readySave () {
      this.$refs.modelInfo.validate((valid) => {
        if (valid) {
          this.$bus.emit('save', this.modelInfo);
        }
      });
    }
  }
};
</script>

<style scoped>
.el-form {
  text-align: center;
  padding: 0 37px;
}
.el-input {
  width: 250px;
}
</style>