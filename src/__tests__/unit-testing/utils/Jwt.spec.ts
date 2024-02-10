// Importing the necessary modules
import JwtToken from '../../../utils/jwt/jwt';
import jwt from 'jsonwebtoken';
import keys from '../../../config/keys';

// Mocking the jsonwebtoken module
jest.mock('jsonwebtoken');

describe('JwtToken', () => {
  describe('generateToken', () => {
    it('should generate a token successfully', async () => {
      const mockPayload = { id: '123' };
      const mockToken = 'token123';

      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const token = await JwtToken.generateToken(mockPayload);

      expect(jwt.sign).toHaveBeenCalledWith(mockPayload, keys.JWT.SECRET, {
        expiresIn: keys.JWT.EXPIRES_IN,
      });
      expect(token).toEqual(mockToken);
    });
  });

  describe('verifyToken', () => {
    it('should verify a token successfully', async () => {
      const mockToken = 'token123';
      const mockDecoded = { id: '123' };

      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const decoded = await JwtToken.verifyToken(mockToken);

      // Verifying that jwt.verify was called with the correct arguments
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, keys.JWT.SECRET);
      expect(decoded).toEqual(mockDecoded);
    });

    it('should throw an error if token verification fails', async () => {
      const mockToken = 'invalidToken';

      // Mock jwt.verify to throw an error
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(JwtToken.verifyToken(mockToken)).rejects.toThrow(
        'Invalid token'
      );
    });
  });
});
