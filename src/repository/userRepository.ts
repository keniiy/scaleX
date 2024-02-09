import UserData from '../utils/data/user';

const AdminUserCsvPath = '../../utils/csv/AdminUser.csv';
const regularUserCsvPath = '../../utils/csv/RegularUser';

export default class AuthRepository {
  /**
   * @static
   * @description This method is used to login a user
   * @param {object} body - The request body
   * @returns {object} - The response object
   */
  static async findUserByEmail(email: string) {
    return UserData.find((user) => user.email === email);
  }

  /**
   * @static
   * @description This method is used to find a user by id
   * @param {number} id - The user id
   * @returns {object} - The response object
   */
  static async findUserById(id: number) {
    return UserData.find((user) => user.id === id);
  }
}
