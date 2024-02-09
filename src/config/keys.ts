import dotenv from 'dotenv';
dotenv.config();

const keys = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT: {
    SECRET: process.env.JWT_SECRET || 'secret',
    EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  },
};

export default keys;
