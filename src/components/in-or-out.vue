<template>
  <div>
    <el-form label-suffix=":" :rules="rules" ref="modelInfo" label-width="90px" :model="modelInfo">
      <el-form-item label="食品名称" prop="foodId">
        <el-select filterable v-model="modelInfo.foodId" placeholder="请选择">
          <el-option v-for="item in foodInfo" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="quantity">
        <el-input v-model="modelInfo.quantity"></el-input>
      </el-form-item>
      <el-form-item label="操作人" prop="operatorId">
        <el-select filterable v-model="modelInfo.operatorId" placeholder="请选择">
          <el-option v-for="item in operatorInfo" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
  props: { info: Object, isSave: Boolean },
  data () {
    return {
      modelInfo: {},
      foodInfo: [],
      operatorInfo: [],
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
    },
    // 是否保存
    isSave () {
      if (this.isSave) {
        this.save();
      }
    }
  },
  mounted () {
    this.getFoodInfo();
    this.getOperatorInfo();
  },
  methods: {
    // 获取食品信息，用于select选项
    getFoodInfo () {
      StockApi.search(this.query)
        .then((res) => {
          // isDelete表示该数据已删除，不显示
          this.foodInfo = res.data.filter(item => !item.isDelete);
        });
    },
    // 获取员工信息，用于select选项
    getOperatorInfo () {
      StaffApi.search(this.query)
        .then((res) => {
          // isDelete表示该数据已删除，不显示
          this.operatorInfo = res.data.filter(item => !item.isDelete);
        });
    },
    // 保存，向父组件传递数据，请父组件调用方法保存
    save () {
      this.$refs.modelInfo.validate((valid) => {
        if (valid) {
          this.$emit('saveInfo', this.modelInfo);
        } else {
          this.$emit('notRule');
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