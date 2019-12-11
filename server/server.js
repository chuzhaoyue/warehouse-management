const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mysql = require('mysql');

const PORT = 8080; // 端口

let db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'warehouse'
});

// 请求数据库
function query(sql) {
  return new Promise((resolve, reject) => {
    db.query(sql + `;`, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    })
  });
}

let app = new Koa();
let router = new Router();
app.use(bodyParser());

// 错误处理
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {
      code: 1,
      message: 'server error'
    };
  }
});

// 出入库信息 图表查询
router.get('/inAndOut/chart', async ctx => {
  let data = await query(`SELECT inQua.time AS time,inQua AS '入库数量',outQua AS '出库数量' FROM inQua,outQua WHERE inQua.time = outQua.time`);
  ctx.body = {
    code: '0',
    message: 'OK',
    data
  };
});

// 库存信息 图表查询
router.get('/stock/chart', async ctx => {
  let sql = `SELECT name, stock AS value FROM stock WHERE stock != 0`;
  let data = await query(sql);
  ctx.body = {
    code: '0',
    message: 'OK',
    data
  };
});

// list 查询
router.post('/*/search', async ctx => {
  const apiName = ctx.url.split('/')[1];
  const key = apiName === 'staff' || apiName === 'stock' ? 'name' : 'foodName'; // search关键字
  const {
    value,
    pagination
  } = ctx.request.body;
  let items = '';
  // 要查询的字段
  if (apiName === 'inware' || apiName === 'outware') {
    items = `id,foodName,quantity,brand,operatorName,editable,DATE_FORMAT(time,'%Y-%m-%d %H:%i:%S') AS time`;
  } else if (apiName === 'staff') {
    items = 'id,name,sex,phone,email';
  } else if (apiName === 'stock') {
    items = 'id,name,brand,stock';
  }
  // sql语句
  let infoSql = `SELECT ${items} FROM ${apiName} WHERE isDelete=0`;
  let countSql = `SELECT count(*) AS count FROM ${apiName} WHERE isDelete=0`;
  if (value) {
    const sqlKey = ` AND ${key} LIKE '%${value}%'`;
    infoSql += sqlKey;
    countSql += sqlKey;
  }
  if (apiName === 'inware' || apiName === 'outware') {
    infoSql += ` ORDER BY time DESC`;
  }
  infoSql += ` LIMIT ${(pagination.currentPage - 1) * pagination.pageSize}, ${pagination.pageSize}`;
  const data = await query(infoSql);
  const count = await query(countSql);
  pagination.total = count[0].count; // 总条数
  pagination.pageCount = Math.ceil(pagination.total / pagination.pageSize); // 总页数
  ctx.body = {
    code: '0',
    message: 'OK',
    data,
    pagination
  };
});

// 单个详细信息查询
router.get('/*/single/:id', async ctx => {
  const apiName = ctx.url.split('/')[1];
  let sql = `SELECT * FROM ${apiName} WHERE id=${ctx.params.id}`;
  if (apiName === 'staff') {
    sql = `SELECT *,DATE_FORMAT(startWork,'%Y-%m-%d') AS startWork FROM ${apiName} WHERE id=${ctx.params.id}`;
  }
  let data = await query(sql);
  ctx.body = {
    code: '0',
    message: 'OK',
    data: data[0]
  };
});

// select 查询
router.get('/*/select', async ctx => {
  const apiName = ctx.url.split('/')[1];
  let items = apiName === 'stock' ? `id,name,stock` : `id,name`;
  const data = await query(`SELECT ${items} FROM ${apiName} WHERE isDelete=0`);
  ctx.body = {
    code: '0',
    message: 'OK',
    data
  };
});

// 新增
router.post('/*/save', async ctx => {
  const apiName = ctx.url.split('/')[1];
  const info = ctx.request.body;
  // 更新库存
  if (apiName === 'inware' || apiName === 'outware') {
    let food = await query(`SELECT name,brand FROM stock WHERE id=${info.foodId}`);
    let staff = await query(`SELECT name FROM staff WHERE id=${info.operatorId}`);
    info.foodName = food[0].name;
    info.brand = food[0].brand;
    info.operatorName = staff[0].name;
    if (apiName === 'inware') {
      query(`UPDATE stock SET stock = stock + ${info.quantity} WHERE id = '${info.foodId}'`);
    } else {
      query(`UPDATE stock SET stock = stock - ${info.quantity} WHERE id = '${info.foodId}'`);
    }
  }
  for (let item in info) {
    info[item] = `'${info[item]}'`;
  }
  await query(`INSERT INTO ${apiName} (${Object.keys(info).join()}) VALUES(${Object.values(info).join()})`);
  ctx.body = {
    code: '0',
    message: 'OK'
  };
});

// 修改
router.put('/*/save', async ctx => {
  const apiName = ctx.url.split('/')[1];
  const info = ctx.request.body;
  // 更新库存
  if (apiName === 'inware' || apiName === 'outware') {
    let food = await query(`SELECT name,brand FROM stock WHERE id=${info.foodId}`);
    let staff = await query(`SELECT name FROM staff WHERE id=${info.operatorId}`);
    info.foodName = food[0].name;
    info.brand = food[0].brand;
    info.operatorName = staff[0].name;
    let old = await query(`SELECT foodId,quantity FROM ${apiName} WHERE id=${info.id}`);
    let {
      foodId: oldFoodId,
      quantity: oldQuantity
    } = old[0];
    if (apiName === 'inware') {
      query(`UPDATE stock SET stock = stock - ${oldQuantity} WHERE id = '${oldFoodId}'`);
      query(`UPDATE stock SET stock = stock + ${info.quantity} WHERE id = '${info.foodId}'`);
    } else {
      query(`UPDATE stock SET stock = stock + ${oldQuantity} WHERE id = '${oldFoodId}'`);
      query(`UPDATE stock SET stock = stock - ${info.quantity} WHERE id = '${info.foodId}'`);
    }
  }
  let arr = [];
  for (let item in info) {
    arr[arr.length] = (item !== 'id' && item !== 'time') ? `${item}='${info[item]}'` : `time=now()`;
  }
  let sql = `UPDATE ${apiName} SET ${arr.join()} WHERE id = '${info.id}'`;
  await query(sql);
  ctx.body = {
    code: '0',
    message: 'OK'
  };
});

// 删除
router.delete('/*/delete/:id', async ctx => {
  const apiName = ctx.url.split('/')[1];
  // 更新库存
  if (apiName === 'inware' || apiName === 'outware') {
    let old = await query(`SELECT foodId,quantity FROM ${apiName} WHERE id=${ctx.params.id}`);
    let {
      foodId: oldFoodId,
      quantity: oldQuantity
    } = old[0];
    if (apiName === 'inware') {
      query(`UPDATE stock SET stock = stock - ${oldQuantity} WHERE id = '${oldFoodId}'`);
    } else {
      query(`UPDATE stock SET stock = stock + ${oldQuantity} WHERE id = '${oldFoodId}'`);
    }
  } else if (apiName === 'stock') {
    query(`UPDATE inware SET editable = 0 WHERE foodId = '${ctx.params.id}'`);
    query(`UPDATE outware SET editable = 0 WHERE foodId = '${ctx.params.id}'`);
  }
  await query(`UPDATE ${apiName} SET isDelete=1 WHERE id = '${ctx.params.id}'`);
  ctx.body = {
    code: '0',
    message: 'OK'
  };
});

app.use(router.routes());

app.listen(PORT);