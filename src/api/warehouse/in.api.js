import CommonApi from '../common.api';

class InApi extends CommonApi {
  constructor() {
    super('inware');
  }
}

export default new InApi();