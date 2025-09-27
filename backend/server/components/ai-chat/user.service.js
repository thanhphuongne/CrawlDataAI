import AIUser from './user.model';

/**
 * Create a new AI user
 * @param {string} email
 * @returns {Promise<AIUser>}
 */
export async function createUser(email) {
  try {
    const user = await AIUser.create({ email });
    return user;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<AIUser|null>}
 */
export async function getUserByEmail(email) {
  try {
    const user = await AIUser.findOne({ where: { email } });
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