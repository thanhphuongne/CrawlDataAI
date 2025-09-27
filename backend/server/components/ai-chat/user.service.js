import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import AIUser from './user.model';
import {
  BCRYPT_SALT_ROUNDS,
} from '../../constants';

/**
 * Register a new AI user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<AIUser>}
 */
export async function register(email, password) {
  try {
    const existingUser = await AIUser.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
    const user = await AIUser.create({
      email: email.toLowerCase(),
      password: hashedPassword,
    });
    return user;
  } catch (error) {
    throw new Error(`Error registering user: ${error.message}`);
  }
}

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{user: AIUser, token: string}>}
 */
export async function login(email, password) {
  try {
    const user = await AIUser.findOne({ where: { email: email.toLowerCase() } });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('Invalid email or password');
    }

    const token = user.signJWT();
    return { user, token };
  } catch (error) {
    throw new Error(`Error logging in: ${error.message}`);
  }
}

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<AIUser|null>}
 */
export async function getUserByEmail(email) {
  try {
    const user = await AIUser.findOne({ where: { email: email.toLowerCase() } });
    return user;
  } catch (error) {
    throw new Error(`Error getting user: ${error.message}`);
  }
}

/**
 * Get user by ID
 * @param {number} id
 * @returns {Promise<AIUser|null>}
 */
export async function getUserById(id) {
  try {
    const user = await AIUser.findByPk(id);
    return user;
  } catch (error) {
    throw new Error(`Error getting user: ${error.message}`);
  }
}