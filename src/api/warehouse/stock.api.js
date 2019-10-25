import CommonApi from '../common.api';

class StockApi extends CommonApi {
  constructor() {
    super('Stock');
  }
}

export default new StockApi();