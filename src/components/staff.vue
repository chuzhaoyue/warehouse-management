<template>
  <div>
    <el-form label-suffix=":" :rules="rules" ref="modelInfo" label-width="90px" :model="modelInfo">
      <el-row>
        <el-col :span="9" :offset="1">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="modelInfo.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form-item label="性别" prop="sex">
            <el-select v-model="modelInfo.sex" placeholder="请选择">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="1">
          <el-form-item label="身份证号" prop="idNum">
            <el-input v-model="modelInfo.idNum"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form-item label="入职日期" prop="startWork">
            <el-input v-model="modelInfo.startWork"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="9" :offset="1">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="modelInfo.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9" :offset="1">
          <el-form-item label="电子邮箱" prop="email">
            <el-input v-model="modelInfo.email"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="19" :offset="1">
          <el-form-item label="地址" prop="address">
            <el-input type="textarea" v-model="modelInfo.address"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

export default {
  name: 'staff',
  props: { info: Object },
  data () {
    return {
      modelInfo: {},
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        sex: [
          { required: true, message: '请输入性别', trigger: 'blur' },
          { pattern: /^(男|女)$/, message: '请输入正确的性别', trigger: 'blur' }
        ],
        idNum: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: '请输入正确的身份证号码', trigger: 'blur' }
        ],
        startWork: [
          { required: true, message: '请输入入职日期', trigger: 'blur' },
          { pattern: /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/, message: '请输入正确的日期', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入电子邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        address: [{ required: true, message: '请输入地址', trigger: 'blur' }]
      }
    }
  },
  watch: {
    // form信息
    info (val) {
      this.modelInfo = val;
    }
  },
  created () {
    this.$bus.on('readySave', this.readySave);
  },
  beforeDestroy () {
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
</style>