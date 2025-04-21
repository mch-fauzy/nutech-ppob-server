import morgan from 'morgan';

import {logInfo} from '../common/utils/logging/logger';

class MorganMiddleware {
  static handler = morgan('dev', {
    stream: {
      write: message => {
        logInfo(message.trim());
      },
    },
  });
}

export {MorganMiddleware};
