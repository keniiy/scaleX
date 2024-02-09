import jwt from 'jsonwebtoken';
import keys from '../../config/keys';

export default class JwtToken {
  /**
   * @static
   * @description Generate a token for both user and admin.
   * @param {object} payload - The payload to be used to generate the token.
   * @returns {Promise<string>} The generated token.
   */
  static async generateToken(payload: object): Promise<string> {
    return jwt.sign(payload, keys.JWT.SECRET, {
      expiresIn: keys.JWT.EXPIRES_IN,
    });
  }

  /**
   * @static
   * @description Verify a token.
   * @param {string} token - The token to be verified.
   * @returns {Promise<any>} The verified token.
   */
  static async verifyToken(token: string): Promise<any> {
    return jwt.verify(token, keys.JWT.SECRET);
  }
}
