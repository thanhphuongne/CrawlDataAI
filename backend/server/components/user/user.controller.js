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
    } = req.body;
    const user = await UserService.registry({
      accountName: accountName,
      password: password,

    });

    const loginData = await UserService.login(accountName, password);
    return res.json({
      accessToken: loginData.token,
      user: user,
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

export async function emailRegister(req, res, next) {
  try {
    const {
      email,
      password,
    } = req.body;
    const user = await UserService.emailRegistry({
      email,
      password,
    });

    const loginData = await UserService.emailLogin(email, password);
    return res.json({
      user_id: user.id,
      message: "User registered",
    });
  } catch (error) {
    return next(error);
  }
}

export async function emailLogin(req, res, next) {
  try {
    const {
      email,
      password,
    } = req.body;
    const user = await UserService.emailLogin(email, password);
    return res.json({
      token: user.token,
      user_id: user.id,
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
