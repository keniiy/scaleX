import requester from '../../setup';
import { STATUS_CODE } from '../../../utils/constant/options';

describe('POST /auth/login', () => {
  it('should login as a regular user', async () => {
    const response = await requester.post('/auth/login').send({
      email: 'regularUser@gmail.com',
      password: 'userPassword',
    });

    expect(response.status).toBe(STATUS_CODE.OK);
    expect(response.body.message).toBe('User login successful');
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.email).toBeDefined();
    expect(response.body.data.user.role).toBeDefined();
  });

  it('should login as an admin user', async () => {
    const response = await requester.post('/auth/login').send({
      email: 'adminUser@gmail.com',
      password: 'adminPassword',
    });

    expect(response.status).toBe(STATUS_CODE.OK);
    expect(response.body.message).toBe('Admin login successful');
    expect(response.body.data.accessToken).toBeDefined();
    expect(response.body.data.user.id).toBeDefined();
    expect(response.body.data.user.email).toBeDefined();
    expect(response.body.data.user.role).toBeDefined();
  });

  it('should return error response for invalid credentials', async () => {
    const response = await requester.post('/auth/login').send({
      email: 'invalid@gmail.com',
      password: 'invalidPassword',
    });

    expect(response.status).toBe(STATUS_CODE.CONFLICT);
    expect(response.body.message).toBe('Invalid credentials');
  });

  it('should return error response for missing email', async () => {
    const response = await requester.post('/auth/login').send({
      password: 'password',
    });

    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
  });

  it('should return error response for missing password', async () => {
    const response = await requester.post('/auth/login').send({
      email: 't@gmial.com',
    });

    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
  });

  it('should return error response for missing email and password', async () => {
    const response = await requester.post('/auth/login').send({});

    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
  });
});
