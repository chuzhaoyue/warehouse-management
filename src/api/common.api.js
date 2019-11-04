import { $http } from './index.api';

class CommonApi {
  constructor(name) {
    this.ApiName = name;
  }

  // 查询
  search(query) {
    return $http.post(`/${this.ApiName}/Search`, query);
  }
  // 查询单个
  single(id) {
    return $http.get(`/${this.ApiName}/Single/${id}`);
  }
  // 保存
  save(info) {
    if (info.id) {
      return $http.put(`/${this.ApiName}/Save`, info); // 修改
    } else {
      return $http.post(`/${this.ApiName}/Save`, info); // 新增
    }
  }
  // 删除
  delete(id) {
    return $http.delete(`/${this.ApiName}/Delete/${id}`);
  }
}

export default CommonApi;