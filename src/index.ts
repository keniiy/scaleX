import server from './routes/index';
import keys from './config/keys';
import logger from './config/logger';

const Port = keys.PORT;

const startServer = async () => {
  try {
    server.listen(Port, () => {
      logger.info(`Server listening on port ${Port}`);
    });
  } catch (error) {
    logger.error(`Error starting server: ${JSON.stringify(error)}`);
  }
};

startServer();
