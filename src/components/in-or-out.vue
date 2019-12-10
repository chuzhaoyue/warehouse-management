<template>
  <div>
    <el-form label-suffix=":" :rules="rules" ref="modelInfo" label-width="90px" :model="modelInfo">
      <el-form-item label="食品名称" prop="foodId">
        <el-select filterable v-model="modelInfo.foodId" placeholder="请选择">
          <el-option v-for="item in options.food" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input v-model="modelInfo.quantity"></el-input>
      </el-form-item>
      <el-form-item label="操作人" prop="operatorId">
        <el-select filterable v-model="modelInfo.operatorId" placeholder="请选择">
          <el-option v-for="item in options.staff" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import StockApi from '../api/warehouse/stock.api.js'
import StaffApi from '../api/basic/staff.api.js'

export default {
  name: 'in-or-out',
  props: { info: Object },
  data () {
    return {
      modelInfo: {},
      options: { food: [], staff: [] },
      rules: {
        foodId: [{ required: true, message: '请选择食品', trigger: 'change' }],
        quantity: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { type: 'integer', message: '请输入整数', trigger: 'blur', transform: (value) => Number(value) }
        ],
        operatorId: [{ required: true, message: '请选择操作人', trigger: 'change' }]
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
  mounted () {
    this.getOptions();
    // this.getFoodInfo();
    // this.getOperatorInfo();
  },
  beforeDestroy () {
    this.$bus.off('readySave');
  },
  methods: {
    // 获取options
    getOptions () {
      const promises = [];
      promises.push(StockApi.select());
      promises.push(StaffApi.select());
      Promise.all(promises)
        .then(([food, staff]) => {
          if (food.data.code === '0' && staff.data.code === '0') {
            this.options.food = food.data.data;
            this.options.staff = staff.data.data;
          } else {
            this.$message.error('请求失败');
          }
        })
        .catch(() => {
          this.$message.error('请求失败');
        });
    },
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
  padding: 0 40px;
}
.el-input,
.el-select {
  width: 200px;
}
</style>