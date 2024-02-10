import requester from '../../setup';
import { STATUS_CODE } from '../../../utils/constant/options';

describe('POST /addBook', () => {
  let adminToken: string;
  let userToken: string;

  const newBook = {
    bookName: 'Irrfan Khan: A Life in Movies',
    author: 'Shubhra Gupta',
    year: '2023',
  };

  beforeAll(async () => {
    const adminLoginResponse = await requester.post('/auth/login').send({
      email: 'adminUser@gmail.com',
      password: 'adminPassword',
    });
    adminToken = adminLoginResponse.body.data.accessToken;

    const userLoginResponse = await requester.post('/auth/login').send({
      email: 'regularUser@gmail.com',
      password: 'userPassword',
    });
    userToken = userLoginResponse.body.data.accessToken;
  });

  it('should allow admin to add a book', async () => {
    const response = await requester
      .post('/book/addBook')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newBook);

    expect(response.status).toBe(STATUS_CODE.CREATED);
  });

  it('should prevent regular user from adding a book', async () => {
    const response = await requester
      .post('/book/addBook')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newBook);

    expect(response.status).toBe(STATUS_CODE.FORBIDDEN);
  });

  it('should reject unauthorized requests', async () => {
    const response = await requester.post('/book/addBook').send(newBook);

    expect(response.status).toBe(STATUS_CODE.UNAUTHORIZED);
  });

  it('should return error response for missing bookName', async () => {
    const response = await requester
      .post('/book/addBook')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        author: 'Shubhra Gupta',
        year: '2023',
      });

    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
  });

  it('should return error response for missing author', async () => {
    const response = await requester
      .post('/book/addBook')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        bookName: 'Irrfan Khan: A Life in Movies',
        year: '2023',
      });

    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
  });

  it('should return error response for missing year', async () => {
    const response = await requester
      .post('/book/addBook')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        bookName: 'Irrfan Khan: A Life in Movies',
        author: 'Shubhra Gupta',
      });

    expect(response.status).toBe(STATUS_CODE.BAD_REQUEST);
  });

  describe('Cleanup - Delete Added Book', () => {
    it('should delete the added book', async () => {
      const response = await requester
        .delete(`/book/deleteBook/Irrfan%20Khan:%20A%20Life%20in%20Movies`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(STATUS_CODE.OK);
      expect(response.body.message).toBe('Book deleted successfully');
    });
  });
});
