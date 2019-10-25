import Mock from 'mockjs'
import './common.mock'

var Random = Mock.Random;

Mock.setup({
  timeout: '300-600'
});

// 初始化本地存储数据

var staff = [{
  name: '苏凡',
  sex: '女'
}, {
  name: '夏强',
  sex: '男'
}, {
  name: '丁代珊',
  sex: '女'
}, {
  name: '陈乐天',
  sex: '男'
}, {
  name: '郑涛',
  sex: '男'
}];

Random.extend({
  foods: function () {
    var foods = ['薯片', '糖果', '方便面', '坚果', '大面筋', '小面包', '火腿', '饼干', '威化'];
    return this.pick(foods);
  }
});

(function () {
  if (!localStorage.getItem('warehouseInfo')) {
    var warehouseInfo = {
      staffInfo: [],
      stockInfo: [],
      inInfo: [],
      outInfo: []
    };

    warehouseInfo.stockInfo = [{
        id: 1,
        name: '薯片',
        stock: 0,
        isDelete: false,
        brand: '好丽友'
      },
      {
        id: 2,
        name: '奶糖',
        stock: 0,
        isDelete: false,
        brand: '大白兔'
      },
      {
        id: 3,
        name: '方便面',
        stock: 0,
        isDelete: false,
        brand: '康师傅'
      },
      {
        id: 4,
        name: '坚果',
        stock: 0,
        isDelete: false,
        brand: '三只松鼠'
      },
      {
        id: 5,
        name: '大面筋',
        stock: 0,
        isDelete: false,
        brand: '卫龙'
      },
      {
        id: 6,
        name: '小面包',
        stock: 0,
        isDelete: false,
        brand: '盼盼'
      },
      {
        id: 7,
        name: '火腿',
        stock: 0,
        isDelete: false,
        brand: '双汇'
      },
      {
        id: 8,
        name: '饼干',
        stock: 0,
        isDelete: false,
        brand: '趣多多'
      },
      {
        id: 9,
        name: '威化',
        stock: 0,
        isDelete: false,
        brand: '奥利奥'
      },
    ]

    var wstaff = warehouseInfo.staffInfo;
    var wstock = warehouseInfo.stockInfo;
    var win = warehouseInfo.inInfo;
    var wout = warehouseInfo.outInfo;

    for (var i = 0; i < 5; i++) {
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

    for (var j = 0; j < 20; j++) {
      win.push(Mock.mock({
        id: j + 1,
        foodId: '@integer(1,9)',
        quantity: '@integer(60,100)',
        operatorId: '@integer(1,5)'
      }));
      win[j].foodName = wstock[win[j].foodId - 1].name;
      win[j].brand = wstock[win[j].foodId - 1].brand;
      win[j].operatorName = wstaff[win[j].operatorId - 1].name;
      wstock[win[j].foodId - 1].stock += win[j].quantity; // 更新库存
    }

    for (var k = 0; k < 5; k++) {
      wout.push(Mock.mock({
        id: k + 1,
        foodId: '@integer(1,9)',
        quantity: '@integer(5,10)',
        operatorId: '@integer(1,5)'
      }));
      wout[k].foodName = wstock[wout[k].foodId - 1].name;
      wout[k].brand = wstock[wout[k].foodId - 1].brand;
      wout[k].operatorName = wstaff[wout[k].operatorId - 1].name;
      wstock[wout[k].foodId - 1].stock -= wout[k].quantity; // 更新库存
    }
    localStorage.setItem('warehouseInfo', JSON.stringify(warehouseInfo));
  }
}())