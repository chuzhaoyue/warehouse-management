// import Vue from 'vue';
import axios from 'axios';

// Vue.prototype.$http = axios;

axios.defaults.baseURL='/api';

export {
  axios as $http
}