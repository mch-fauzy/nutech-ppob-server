import express, {json} from 'express';
import {createServer} from 'http';
import cors from 'cors';

import {CONFIG} from './configs/config';
import {ErrorResponseMiddleware} from './middlewares/error-response-middleware';
import {MorganMiddleware} from './middlewares/morgan-middleware';
import {router} from './routes';
import {logInfo} from './common/utils/logging/logger';
import {handleError} from './common/utils/errors/error-handler';
import {prismaClient} from './configs/prisma-client';

/** Initialize Express application */
const app = express();
const port = CONFIG.SERVER.PORT;

/** Set up middlewares in a defined order */
app.use(cors());
app.use(json());
app.use(MorganMiddleware.handler);
app.use(express.static(CONFIG.APP.STATIC_DIRECTORY!));
app.use('/', router);
app.use(ErrorResponseMiddleware.handler);

/** Function to ping the database */
const pingDatabase = async (): Promise<void> => {
  await prismaClient.$queryRaw`SELECT 1`;
  logInfo('Connected to Database');
};

/** Function to start the server */
const startServer = async (): Promise<void> => {
  try {
    /** Wait for database connection */
    await pingDatabase();

    /** Create an HTTP server instance from the Express app */
    const server = createServer(app);
    server.listen(port, () => {
      logInfo(`Server running. Port: ${port}`);
    });

    /** Handle server runtime errors */
    server.on('error', error => {
      throw handleError({
        operationName: 'startServer',
        error,
      });
    });
  } catch (error) {
    throw handleError({
      operationName: 'startServer',
      error,
    });
  }
};

/** void: Explicitly ignore the return result of a function */
void startServer();
