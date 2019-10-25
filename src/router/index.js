import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../pages/index.vue'
import Home from '../pages/home.vue'
import Basic from '../pages/basic/index.vue'
import Staff from '../pages/basic/staff.vue'
import Warehouse from '../pages/warehouse/index.vue'
import In from '../pages/warehouse/in.vue'
import Out from '../pages/warehouse/out.vue'
import Stock from '../pages/warehouse/stock.vue';

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

const routes = [{
    path: '/',
    name: 'index',
    component: Index,
    meta: '首页',
    redirect: '/home',
    children: [{
        path: 'home',
        name: 'home',
        component: Home
      },
      {
        path: 'basic',
        name: 'basic',
        component: Basic,
        meta: '基础信息',
        redirect: '/basic/staff-list',
        children: [{
          path: 'staff-list',
          name: 'staff-list',
          component: Staff,
          meta: '员工管理'
        }]
      },
      {
        path: 'warehouse',
        name: 'warehouse',
        component: Warehouse,
        meta: '仓库管理',
        redirect: '/warehouse/stock',
        children: [{
            path: 'stock',
            name: 'stock',
            component: Stock,
            meta: '库存信息'
          },
          {
            path: 'in-list',
            name: 'in-list',
            component: In,
            meta: '入库信息'
          },
          {
            path: 'out-list',
            name: 'out-list',
            component: Out,
            meta: '出库信息'
          }
        ]
      }
    ]
  },
  {
    path: '*',
    redirect: '/'
  }
]


const router = new VueRouter({
  routes // (缩写) 相当于 routes: routes
})

export default router;