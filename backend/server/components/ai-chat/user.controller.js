import * as UserService from './user.service';

/**
 * Register new user
 */
export async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await UserService.register(email, password);
    const loginData = await UserService.login(email, password);
    return res.json({
      success: true,
      accessToken: loginData.token,
      user: user,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Login user
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await UserService.login(email, password);
    return res.json({
      success: true,
      accessToken: token,
      user: user,
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * Get current user (me)
 */
export async function getMe(req, res, next) {
  try {
    const user = req.auth;
    return res.json({
      success: true,
      user: user,
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