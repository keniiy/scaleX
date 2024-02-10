import request from 'supertest';
import { startServer } from '../index';
import server from '../routes/index';

describe('Server Startup', () => {
  let serverInstance: ReturnType<typeof startServer>;

  beforeAll(() => {
    serverInstance = startServer();
  });

  afterAll((done) => {
    serverInstance.close(done);
  });

  it('should start the server and respond to a health check', async () => {
    const response = await request(server).get('/healthcheck');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('ScaleX API is healthy');
  });

  it('should respond with 404 for unknown routes', async () => {
    const response = await request(server).get('/unknown-route');
    expect(response.statusCode).toBe(404);
    expect(response.text).toContain('Resource not found');
  });
});
