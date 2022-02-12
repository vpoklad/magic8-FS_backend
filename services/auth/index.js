import jwt from 'jsonwebtoken';
import UsersRepository from '../../repository/user';

const SECRET_KEY = process.env.JWT_SECRET_KEY;

class AuthService {
  async isUserExist(email) {
    const user = await UsersRepository.findByEmail(email);
    return !!user;
  }

  async create(body) {
    const { id, balance, email, avatarURL, verificationToken } =
      await UsersRepository.createNewUser(body);
    return { id, balance, email, avatarURL, verificationToken };
  }

  async getUser(email, password) {
    const user = await UsersRepository.findByEmail(email);
    const isValidPassword = await user?.isValidPassword(password);
    if (!isValidPassword || !user?.isVerify) {
      return null;
    }
    return user;
  }

  async getUserFromGoogle(email) {
    const user = await UsersRepository.findByEmail(email);
    return user;
  }

  async getBalance(userId) {
    const { balance } = await UsersRepository.findById(userId);
    return balance;
  }

  async setBalance(userId, balance) {
    return await UsersRepository.updateBalance(userId, balance);
  }

  getToken(user) {
    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '3h' });
    return token;
  }

  async setToken(id, token) {
    await UsersRepository.updateToken(id, token);
  }
}

export default new AuthService();
