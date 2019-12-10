<template>
  <div class="wrapper">
    <div id="line"></div>
    <div id="pie"></div>
  </div>
</template>
<script>
import ChartApi from '../api/chart/chart'
// 引入 echarts 主模块
import * as echarts from 'echarts/lib/echarts';
// 引入折线图和饼图
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
// 引入提示框组件、标题组件、图例组件。
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

export default {
  name: 'home',
  data () {
    return {
      lineOption: {
        title: { text: '近七日出入库信息', left: 'center', bottom: '5%' },
        legend: { left: '5%', top: '5%' },
        grid: { width: '85%', height: '60%', top: 'center' },
        tooltip: { trigger: 'axis' },
        dataset: { source: [] },
        xAxis: { type: 'category', boundaryGap: false },
        yAxis: {},
        series: [{ type: 'line' }, { type: 'line' }]
      },
      pieOption: {
        title: { text: '库存信息', left: 'center', bottom: '5%' },
        tooltip: { trigger: 'item', formatter: "{a} <br/>{b} : {c} ({d}%)" },
        legend: { orient: 'vertical', right: '8%', top: '5%' },
        series: [{
          name: '库存',
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['45%', '50%'],
          data: [],
          itemStyle: { emphasis: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' } }
        }]
      }
    }
  },
  created () {
  },
  mounted () {
    this.getData();
  },
  methods: {
    getData () {
      const promises = [];
      promises.push(ChartApi.inAndOut());
      promises.push(ChartApi.stock());
      Promise.all(promises)
        .then(([inAndOut, stock]) => {
          if (inAndOut.data.code === '0' && stock.data.code === '0') {
            this.lineOption.dataset.source = inAndOut.data.data.map(item => {
              if (!item['入库数量']) item['入库数量'] = 0;
              if (!item['出库数量']) item['出库数量'] = 0;
              return item;
            });
            this.pieOption.series[0].data = stock.data.data;
            this.draw();
          } else {
            this.$message.error('请求失败');
          }
        })
        .catch(() => {
          this.$message.error('请求失败');
        });
    },
    draw () {
      // 基于准备好的dom，初始化echarts实例
      let line = echarts.init(document.getElementById('line'));
      let pie = echarts.init(document.getElementById('pie'));
      //防止越界，重绘canvas
      window.onresize = function () {
        line.resize();
        pie.resize();
      }
      // 设置option
      line.setOption(this.lineOption);
      pie.setOption(this.pieOption);
    }
  }
};
</script>

<style scoped>
.wrapper {
  height: 600px;
  display: flex;
  justify-content: center;
}
#line {
  width: 50%;
}
#pie {
  width: 50%;
}
</style>