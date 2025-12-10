import * as UserService from './user.service';
import { ROOT_PATH } from '../../constants';
import APIError from '../../util/APIError';
// import * as PaymentHistoryService from "../paymentHistory/paymentHistory.service";
// import { getReferralInviteeqqq } from "./user.service";

export async function registry(req, res, next) {
  try {
    const {
      accountName,
      password,
      email,
    } = req.body;
    const user = await UserService.registry({
      accountName: accountName,
      password: password,
      email: email,
    });

    // Don't auto-login, require verification first
    return res.json({
      success: true,
      message: 'Registration successful. Please check your email for verification code.',
      user: {
        id: user.id,
        accountName: user.accountName,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    return next(error);
  }
}
export async function registryList(req, res, next) {
  try {
    const { firstName, lastName, userList, password } = req.body;

    const usersToRegister = userList.map(accountName => ({
      accountName,
      firstName,
      lastName,
      password,
    }));

    const createdUsers = await Promise.all(
      usersToRegister.map(async (user) => {
        return await UserService.registry(user);
      })
    );

    return res.json({
      success: true,
      message: "Success",
      users: createdUsers,
    });

  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const {
      body,
    } = req;
    // console.log("=====",body)
    const user = await UserService.login(body.accountName, body.password);
    return res.json({
      success: true,
      accessToken: user.token,
      user: user,
    });

  } catch (error) {
    return next(error);
  }
}

export async function verifyOTP(req, res, next) {
  try {
    const { accountName, otp } = req.body;
    const result = await UserService.verifyOTP(accountName, otp);
    
    // Auto-login after successful verification
    const loginData = await UserService.login(accountName, req.body.password);
    
    return res.json({
      success: true,
      message: result.message,
      accessToken: loginData.token,
      user: loginData,
    });
  } catch (error) {
    return next(error);
  }
}

export async function resendOTP(req, res, next) {
  try {
    const { accountName } = req.body;
    const result = await UserService.resendOTP(accountName);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
}

export async function emailRegister(req, res, next) {
  try {
    const {
      accountName,
      password,
    } = req.body;
    const user = await UserService.registry({
      accountName,
      password,
    });

    return res.json({
      success: true,
      message: "User registered successfully. Please check your email to verify your account.",
      user: {
        id: user.id,
        accountName: user.accountName,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function emailLogin(req, res, next) {
  try {
    const {
      accountName,
      password,
      rememberMe = true, // Default to remember me
    } = req.body;
    const user = await UserService.login(accountName, password);
    
    // Set HttpOnly cookie with JWT token
    const cookieOptions = {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000, // 7 days or 1 day
    };
    
    res.cookie('auth_token', user.token, cookieOptions);
    
    return res.json({
      success: true,
      accessToken: user.token, // Still send for backward compatibility (remove later)
      user: {
        id: user.id,
        accountName: user.accountName,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    return next(error);
  }
}

export async function getUser(req, res, next) {
  try {
    const {
      auth,
    } = req;

    // console.log("getUser auth: ", auth);
    const user = await UserService.getUserProfile(auth.id);

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
}

export async function getUserByEmail(req, res, next) {
  try {
    let user = await UserService.getUser({ email: req.query?.email });
    if (!user) {
      return next(new APIError(404, 'User not found'));
    }
    console.log(user);
    user = user.toJSON();
    delete user.role;
    delete user.status;
    delete user.id;
    return res.json({
      success: true,
      user: user,
    });

  } catch (error) {
    return next(error);
  }
}

export async function updateUserProfile(req, res, next) {
  try {
    const {
      body,
      auth,
    } = req;
    const info = {};
    const files = req.files;
    const fileKeys = Object.keys(files);
    fileKeys?.forEach((fileKey) => {
      const file = files[fileKey]?.[0];
      if (file) {
        const rootPath = file.destination.replace(`${ROOT_PATH}/`, '');
        file.url = `${rootPath}/${file.filename}`;
        info[fileKey] = file;
      }
    });
    Object.keys(body).forEach((bodyKey) => {
      info[bodyKey] = body[bodyKey];
    });
    await UserService.updateUserProfile(auth, info);
    return res.json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateUserProfileById(req, res, next) {
  try {
    const { id } = req.params;
    const { email } = req.body;
    // Simple update for email
    await UserService.updateUserProfileById(id, { email });
    return res.json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateUserPassword(req, res, next) {
  try {
    const auth = req.auth;
    const body = req.body;
    await UserService.updateUserPassword(auth, body);
    return res.json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const body = req.body;
    const data = await UserService.forgotPassword(body.email);
    return res.json({
      success: true,
      payload: data,
    });
  } catch (error) {
    return next(error);
  }
}

export async function verifyForgotPasswordCode(req, res, next) {
  try {
    const body = req.body;
    const data = await UserService.verifyForgotPasswordCode(body.verifyCode, body.email);
    return res.json({
      success: true,
      payload: data,
    });
  } catch (error) {
    return next(error);
  }
}

export async function verifyForgotPassword(req, res, next) {
  try {
    const auth = req.auth;
    const newPassword = req.body.newPassword;
    await UserService.verifyForgotPassword(auth, newPassword);
    return res.json({
      success: true,
      payload: 'Password update success, please login with new password',
    });
  } catch (error) {
    return next(error);
  }
}

export async function getUsers(req, res, next) {
  try {

    const users = await UserService.adminGetUsers({
      page: req.query.page,
      rowPerPage: req.query.size,
      textSearch: req.query.textSearch
    });
    return res.json({
      success: true,
      payload: users,
    });
  } catch (error) {
    return next(error);
  }
}
export async function getSupervisorUsers(req, res, next) {
  try {

    const users = await UserService.GetSupervisorUsers({
      page: req.query.page,
      rowPerPage: req.query.rowPerPage,
      textSearch: req.query.textSearch
    });
    return res.json({
      success: true,
      payload: users,
    });
  } catch (error) {
    return next(error);
  }
}
export async function getReferralInvitee(req, res, next) {
  try {
    const data = await UserService.getReferralInvitee(req.auth, {
      page: req.query.page,
      rowPerPage: req.query.rowPerPage,
    });
    return res.json({
      success: true,
      payload: data,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getReferralInviter(req, res, next) {
  try {
    const data = await UserService.getReferralInviter(req.auth);
    return res.json({
      success: true,
      payload: data,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { auth } = req;
    const { id } = req.params;

    // Ensure user can only delete their own account
    if (auth.id !== parseInt(id)) {
      return next(new APIError(403, 'You can only delete your own account'));
    }

    await UserService.deleteUser(auth.id);
    return res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
}
