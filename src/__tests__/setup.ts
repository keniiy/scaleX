import supertest from 'supertest';
import app from '../routes/index';

const requester = supertest(app);

export default requester;
