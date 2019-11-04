import Mock from 'mockjs'

// url正则匹配
const url = {
  searchUrl: /^\/(Staff|In|Out|Stock)\/Search$/,
  singleUrl: /^\/(Staff|In|Out|Stock)\/Single\/\d+$/,
  saveUrl: /^\/(Staff|In|Out|Stock)\/Save$/,
  deleteUrl: /^\/(Staff|In|Out|Stock)\/Delete\/\d+$/,
};

const allInfo = {
  Staff: 'staffInfo',
  Stock: 'stockInfo',
  In: 'inInfo',
  Out: 'outInfo'
};

// 拦截Search
Mock.mock(url.searchUrl, 'post', function (options) {
  // 判断请求的是哪个url（Staff/Stock/In/Out）
  const name = options.url.split('/')[1];
  const info = JSON.parse(localStorage.getItem('warehouseInfo'))[allInfo[name]];
  if (!options.body) {
    return info;
  } else {
    // 返回匹配的查询信息
    const reg = new RegExp(options.body);
    if (name === 'Staff' || name === 'Stock') {
      return info.filter(item => reg.test(item.name));
    } else {
      return info.filter(item => reg.test(item.foodName));
    }
  }
})

// 拦截Single
Mock.mock(url.singleUrl, 'get', function (options) {
  const name = options.url.split('/')[1];
  const info = JSON.parse(localStorage.getItem('warehouseInfo'))[allInfo[name]];
  const id = options.url.split('/').pop();
  return (info.find(item => item.id == id)); // 返回id匹配的信息
})

// 拦截Save（修改）
Mock.mock(url.saveUrl, 'put', function (options) {
  const name = options.url.split('/')[1];
  const attr = allInfo[name];
  let warehouseInfo = JSON.parse(localStorage.getItem('warehouseInfo'));
  let info = JSON.parse(options.body);
  if (name === 'In' || name === 'Out') {
    let wstaff = warehouseInfo.staffInfo;
    let wstock = warehouseInfo.stockInfo;
    let win = warehouseInfo.inInfo;
    let wout = warehouseInfo.outInfo;
    // 根据食品id、操作人id设置食品名称、厂家、操作员
    info.foodName = wstock[info.foodId - 1].name;
    info.brand = wstock[info.foodId - 1].brand;
    info.operatorName = wstaff[info.operatorId - 1].name;
    // 更新库存
    if (name === 'In') {
      wstock[win[info.id - 1].foodId - 1].stock -= win[info.id - 1].quantity;
      wstock[info.foodId - 1].stock = Number(wstock[info.foodId - 1].stock) + Number(info.quantity);
    } else {
      wstock[wout[info.id - 1].foodId - 1].stock = Number(wstock[wout[info.id - 1].foodId - 1].stock) + Number(wout[info.id - 1].quantity);
      wstock[info.foodId - 1].stock -= info.quantity;
    }
  }
  warehouseInfo[attr][info.id - 1] = info;
  localStorage.setItem('warehouseInfo', JSON.stringify(warehouseInfo));
})

// 拦截Save（新增）
Mock.mock(url.saveUrl, 'post', function (options) {
  const name = options.url.split('/')[1];
  const attr = allInfo[name];
  let warehouseInfo = JSON.parse(localStorage.getItem('warehouseInfo'));
  let info = JSON.parse(options.body);
  if (name === 'Stock') {
    info.stock = 0;
  } else if (name === 'In' || name === 'Out') {
    let wstaff = warehouseInfo.staffInfo;
    let wstock = warehouseInfo.stockInfo;
    // 根据食品id、操作人id设置食品名称、厂家、操作员
    info.foodName = wstock[info.foodId - 1].name;
    info.brand = wstock[info.foodId - 1].brand;
    info.operatorName = wstaff[info.operatorId - 1].name;
    if (name === 'In') {
      wstock[info.foodId - 1].stock = Number(wstock[info.foodId - 1].stock) + Number(info.quantity); // 更新库存
    } else {
      wstock[info.foodId - 1].stock -= info.quantity; // 更新库存
    }
  }
  info.isDelete = false;
  info.id = warehouseInfo[attr].length + 1;
  warehouseInfo[attr].push(info);
  localStorage.setItem('warehouseInfo', JSON.stringify(warehouseInfo));
})

// 拦截Delete
Mock.mock(url.deleteUrl, 'delete', function (options) {
  const name = options.url.split('/')[1];
  const id = options.url.split('/').pop();
  let warehouseInfo = JSON.parse(localStorage.getItem('warehouseInfo'));
  if (name === 'In' || name === 'Out') {
    let wstock = warehouseInfo.stockInfo;
    if (name === 'In') {
      let info = warehouseInfo.inInfo[id - 1]
      wstock[info.foodId - 1].stock -=info.quantity; // 更新库存
    } else {
      let info = warehouseInfo.outInfo[id - 1]
      wstock[info.foodId - 1].stock = Number(wstock[info.foodId - 1].stock) + Number(info.quantity); // 更新库存
    }
  }
  warehouseInfo[allInfo[name]][id - 1].isDelete = true; // 将isDelete设置为true
  localStorage.setItem('warehouseInfo', JSON.stringify(warehouseInfo));
})