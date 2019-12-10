import CommonApi from '../common.api';

class StaffApi extends CommonApi {
  constructor() {
    super('staff');
  }
}

export default new StaffApi();