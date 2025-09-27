import * as UserService from './user.service';

/**
 * Create user
 */
export async function createUser(req, res, next) {
  try {
    const { email } = req.body;
    const user = await UserService.createUser(email);
    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(req, res, next) {
  try {
    const { email } = req.query;
    const user = await UserService.getUserByEmail(email);
    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return next(error);
  }
}