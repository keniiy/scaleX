import requester from '../../setup';
import { STATUS_CODE } from '../../../utils/constant/options';

describe('DELETE /deleteBook/:bookName', () => {
  let adminToken: string;
  let userToken: string;
  const bookToAddAndDelete = {
    bookName: 'Irrfan Khan: A Life in Movies',
    author: 'Shubhra Gupta',
    year: '2023',
  };
  const bookNameToDelete = encodeURIComponent(bookToAddAndDelete.bookName);

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

    await requester
      .post('/book/addBook')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(bookToAddAndDelete);
  });

  it('should allow an admin to delete a book', async () => {
    const response = await requester
      .delete(`/book/deleteBook/${bookNameToDelete}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(STATUS_CODE.OK);
    expect(response.body.message).toBe('Book deleted successfully');
  });

  it('should prevent a regular user from deleting a book', async () => {
    const response = await requester
      .delete(`/book/deleteBook/${bookNameToDelete}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(response.status).toBe(STATUS_CODE.FORBIDDEN);
  });

  it('should return an error if the book does not exist', async () => {
    const response = await requester
      .delete(`/book/deleteBook/nonexistentBook`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(STATUS_CODE.NOT_FOUND);
  });
});
