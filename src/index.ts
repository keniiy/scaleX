import server from './routes/index';
import keys from './config/keys';
import logger from './config/logger';
import http from 'http';

const Port = keys.PORT || 3000;

export const startServer = (): http.Server => {
  const serverInstance = server.listen(Port, () => {
    logger.info(`Server listening on port ${Port}`);
  });
  return serverInstance;
};

if (require.main === module) {
  startServer();
}
