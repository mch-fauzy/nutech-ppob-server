import express, { json } from 'express';
import { createServer } from 'http';
import cors from 'cors';

import { CONFIG } from './configs/config';
import { logger } from './configs/winston';
import { errorHandler } from './middlewares/error-handler-middleware';
import { router } from './routes';
import { initDbConnection } from './utils/connection-check';

const PORT = CONFIG.SERVER.PORT!;
const app = express();

// Declaration of app.use must be ordered, dont random placement
app.use(cors());
app.use(json());
app.use(express.static(CONFIG.APP.STATIC!));

app.use('/', router);
app.use(errorHandler);

// Wait for both database and Redis connection
Promise.all([initDbConnection()])
    .then(() => {
        // Create an HTTP server instance from the Express app
        const server = createServer(app);

        server.listen(PORT, () => {
            logger.info(`Server running on ${CONFIG.APP.URL}:${PORT}`);
        });

        // Handle startup errors
        server.on('error', (error) => {
            logger.error(`[server] An error occurred while starting the server: ${error}`);
            process.exit(1);
        });
    });
