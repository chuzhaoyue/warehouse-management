import Mock from 'mockjs'
import './common.mock'

Mock.setup({
  timeout: '300-600'
});

// 初始化本地存储数据

const staff = [{
    name: '苏凡',
    sex: '女'
  },
  {
    name: '夏强',
    sex: '男'
  },
  {
    name: '丁代珊',
    sex: '女'
  },
  {
    name: '陈乐天',
    sex: '男'
  },
  {
    name: '郑涛',
    sex: '男'
  }
];

const foods = [{
    name: '薯片',
    brand: '好丽友'
  },
  {
    name: '糖果',
    brand: '大白兔'
  },
  {
    name: '方便面',
    brand: '康师傅'
  },
  {
    name: '坚果',
    brand: '三只松鼠'
  },
  {
    name: '大面筋',
    brand: '卫龙'
  },
  {
    name: '小面包',
    brand: '盼盼'
  },
  {
    name: '火腿',
    brand: '双汇'
  },
  {
    name: '饼干',
    brand: '趣多多'
  },
  {
    name: '威化',
    brand: '奥利奥'
  }
];

(function () {
  if (!localStorage.getItem('warehouseInfo')) {
    let warehouseInfo = {
      staffInfo: [],
      stockInfo: [],
      inInfo: [],
      outInfo: []
    };

    warehouseInfo.stockInfo = foods.map((item, index) => {
      item.id = index + 1;
      item.stock = 0;
      item.isDelete = false;
      return item;
    });

    let wstaff = warehouseInfo.staffInfo;
    let wstock = warehouseInfo.stockInfo;
    let win = warehouseInfo.inInfo;
    let wout = warehouseInfo.outInfo;

    for (let i = 0; i < 5; i++) {
      wstaff.push(Mock.mock({
        idNum: '@id()',
        name: staff[i].name,
        sex: staff[i].sex,
        startWork: '@date',
        isDelete: false,
        phone: /^1[385][1-9]\d{8}/,
        email: '@email',
        add: '@province' + '@city' + '@county'
      }));
      wstaff[i].id = i + 1; // 如果id在上面设置，会影响idNum
    }

    for (let j = 0; j < 20; j++) {
      win.push(Mock.mock({
        id: j + 1,
        foodId: '@integer(1,9)',
        quantity: '@integer(60,100)',
        operatorId: '@integer(1,5)',
        time: '@now'
      }));
      win[j].foodName = wstock[win[j].foodId - 1].name;
      win[j].brand = wstock[win[j].foodId - 1].brand;
      win[j].operatorName = wstaff[win[j].operatorId - 1].name;
      wstock[win[j].foodId - 1].stock += win[j].quantity; // 更新库存
    }

    for (let k = 0; k < 5; k++) {
      wout.push(Mock.mock({
        id: k + 1,
        foodId: '@integer(1,9)',
        quantity: '@integer(1,5)',
        operatorId: '@integer(1,5)',
        time: '@now'
      }));
      wout[k].foodName = wstock[wout[k].foodId - 1].name;
      wout[k].brand = wstock[wout[k].foodId - 1].brand;
      wout[k].operatorName = wstaff[wout[k].operatorId - 1].name;
      wstock[wout[k].foodId - 1].stock -= wout[k].quantity; // 更新库存
    }
    localStorage.setItem('warehouseInfo', JSON.stringify(warehouseInfo));
  }
}())