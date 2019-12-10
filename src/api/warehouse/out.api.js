import CommonApi from '../common.api';

class OutApi extends CommonApi {
  constructor() {
    super('outware');
  }
}

export default new OutApi();