import morgan from 'morgan';

import {logInfo} from '../utils/logger';

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
