import { $http } from '../index.api';
// import CommonApi from '../common.api';

class ChartApi {
  constructor() {}
  // 近七日出库信息
  inAndOut() {
    return $http.get(`/inAndOut/chart`);
  }
  // 库存信息
  stock() {
    return $http.get(`/stock/chart`);
  }
}

export default new ChartApi();