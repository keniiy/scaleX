import requester from '../../setup';
import { STATUS_CODE } from '../../../utils/constant/options';

describe('GET /books', () => {
  let loginAdminUserToken: string;
  let loginRegularUserToken: string;

  beforeAll(async () => {
    const adminResponse = await requester.post('/auth/login').send({
      email: 'adminUser@gmail.com',
      password: 'adminPassword',
    });
    loginAdminUserToken = adminResponse.body.data.accessToken;

    const userResponse = await requester.post('/auth/login').send({
      email: 'regularUser@gmail.com',
      password: 'userPassword',
    });
    loginRegularUserToken = userResponse.body.data.accessToken;
  });

  it('should retrieve books for admin user', async () => {
    const response = await requester
      .get('/book/home')
      .set('Authorization', `Bearer ${loginAdminUserToken}`);
    expect(response.status).toBe(STATUS_CODE.OK);
    expect(response.body.message).toBe('Books retrieved successfully');
    expect(response.body.data).toBeDefined();
  });

  it('should retrieve books for regular user', async () => {
    const response = await requester
      .get('/book/home')
      .set('Authorization', `Bearer ${loginRegularUserToken}`);
    expect(response.status).toBe(STATUS_CODE.OK);
    expect(response.body.message).toBe('Books retrieved successfully');
    expect(response.body.data).toBeDefined();
  });

  it('should return error response for invalid token', async () => {
    const response = await requester
      .get('/book/home')
      .set('Authorization', `Bearer wrongToken`);

    expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);
  });
});
