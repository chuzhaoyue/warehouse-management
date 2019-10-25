import CommonApi from '../common.api';

class StaffApi extends CommonApi {
  constructor() {
    super('Staff');
  }
}

export default new StaffApi();