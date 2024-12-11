import { logger } from '../configs/winston';
import { prismaClient } from '../configs/prisma-client';

// Function to ping the database to init the connection
const initDbConnection = async () => {
    try {
        await prismaClient.$queryRaw`SELECT 1`;
        logger.info('Connected to database');
    } catch (error) {
        logger.error(`[initDbConnection] Utility error connecting to the database: ${JSON.stringify(error)}`);
        process.exit(1); // Exit the application if the database connection fails
    }
};

export { initDbConnection };
