import { $http } from './index.api';

class CommonApi {
  constructor(name) {
    this.ApiName = name;
  }

  // 查询
  search(query) {
    return $http.post(`/${this.ApiName}/search`, query);
  }
  // 查询单个详细信息
  single(id) {
    return $http.get(`/${this.ApiName}/single/${id}`);
  }
  // 获取下拉列表数据
  select() {
    return $http.get(`/${this.ApiName}/select`);
  }
  // 保存
  save(info) {
    if (info.id) {
      return $http.put(`/${this.ApiName}/save`, info); // 修改
    } else {
      return $http.post(`/${this.ApiName}/save`, info); // 新增
    }
  }
  // 删除
  delete(id) {
    return $http.delete(`/${this.ApiName}/delete/${id}`);
  }
}

export default CommonApi;