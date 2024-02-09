import { USER_TYPE } from '../constant/options';

const users = [
  {
    id: 1,
    username: 'adminUser',
    email: 'adminUser@gmail.com',
    password: 'adminPassword',
    role: USER_TYPE.ADMIN,
  },
  {
    id: 2,
    username: 'regularUser',
    email: 'regularUser@gmail.com',
    password: 'userPassword',
    role: USER_TYPE.USER,
  },
];

export default users;
