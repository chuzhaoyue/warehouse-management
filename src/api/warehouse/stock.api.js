import CommonApi from '../common.api';

class StockApi extends CommonApi {
  constructor() {
    super('stock');
  }
}

export default new StockApi();