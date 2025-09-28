import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import crypto from "crypto";
import randomstring from 'randomstring';
// import ms from 'ms';
import logger from '../../util/logger';
import APIError from '../../util/APIError';
import User from './user.model';
// import { getAmountInvitee, getAmountInviter } from '../paymentHistory/paymentHistory.service';
import {
  BCRYPT_SALT_ROUNDS,
  DEFAULT_PAGE_LIMIT,
  FORGOT_PASSWORD_EXPIRE_DURATION,
  MAX_PAGE_LIMIT,
  USER_ROLES,
  USER_STATUS,
} from '../../constants';
import sendEmail from '../../util/sendMail';
import { USER_JWT_SECRET_KEY_FORGOT_PASSWORD } from '../../config';
import { FROMEMAIL } from '../../config';
import triggerSentMailEvent from '../../handlers/triggerSentMailEvent';
/**
 * Registry new user account
 * @param params
 * @param {string} params.firstName String
 * @param {string} params.lastName String
 * @param {string} params.email String
 * @param {string} params.phone String
 * @param {string} params.password String
 * @returns {Promise.<{id: *}>} Return user or an APIError
 */
export async function registry(params) {
  try {
    const existedUser = await User.findOne({ where: { accountName: params.accountName } });
    if (existedUser) {
      // console.log("============")
      throw new APIError(500, 'Account name already used, please try to login instead');
    }
    console.log("====dddđ");
    console.log("===", params.accountName.toLowerCase() + "@fpt.com")
    const userInfo = {
      accountName: params.accountName,
      email: params.accountName.toLowerCase() + "@fpt.com",
      password: bcrypt.hashSync(params.password, BCRYPT_SALT_ROUNDS),
    };
    const user = await User.create(userInfo);
    return user;
  } catch (error) {
    logger.error('User registry create new user error:', error);
    throw new APIError(500, error);
  }
}
export async function registryList(params) {
  try {
    const existedUser = await User.findOne({ where: { email: params.email } });
    if (existedUser) {
      // console.log("============")
      throw new APIError(500, 'Email already used, please try to login instead');
      // throw new APIError(500,
      //   {
      //     value: params.email,
      //     msg: 'Email already used, please try to login instead',
      //     message: 'Email already used, please try to login instead',
      //     param: 'email',
      //     location: 'body',
      //   },
      // );
    }
    const userInfo = {
      first_name: params.firstName,
      last_name: params.lastName,
      email: params.email,
      // phone: params.phone,
      password: bcrypt.hashSync(params.password, BCRYPT_SALT_ROUNDS),
      // referralId: randomstring.generate(7),
    };
    const user = await User.create(userInfo);
    return user;
  } catch (error) {
    logger.error('User registry create new user error:', error);
    throw new APIError(500, error);
  }
}
/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise.<*>} The user model after login success or an error
 */
export async function login(accountName, password) {
  console.log({
    accountName, password
  })

  try {
    let user = await User.findOne({ where: { accountName: accountName } });
    // console.log('login User: ', user);
    if (!user) {
      throw new APIError(403, 'Account name or Password is not correct');
      // throw new APIError(403, [
      //   {
      //     msg: 'The email address that you\'ve entered doesn\'t match any account.',
      //     param: 'emailNotRegistered',
      //   },
      // ]);
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new APIError(403, 'Account name or Password is not correct');
      // throw new APIError(403,
      //   {
      //     msg: 'Email or password is not correct',
      //     param: 'emailPassword',
      //   },
      // );
    }
    const token = user.signJWT();
    user = user.toJSON();
    user.token = token;

    return user;
  } catch (error) {
    console.log(error);
    logger.error(`User login error: ${error}`);
    throw new APIError(500, error);
  }
}

export async function emailRegistry(params) {
  try {
    const existedUser = await User.findOne({ where: { email: params.email } });
    if (existedUser) {
      throw new APIError(500, 'Email already used, please try to login instead');
    }
    const userInfo = {
      email: params.email,
      password: bcrypt.hashSync(params.password, BCRYPT_SALT_ROUNDS),
    };
    const user = await User.create(userInfo);
    return user;
  } catch (error) {
    logger.error('User email registry create new user error:', error);
    throw new APIError(500, error);
  }
}

export async function emailLogin(email, password) {
  try {
    let user = await User.findOne({ where: { email: email } });
    if (!user) {
      throw new APIError(403, 'Email or Password is not correct');
    }
    if (!bcrypt.compareSync(password, user.password)) {
      throw new APIError(403, 'Email or Password is not correct');
    }
    const token = user.signJWT();
    user = user.toJSON();
    user.token = token;

    return user;
  } catch (error) {
    logger.error(`User email login error: ${error}`);
    throw new APIError(500, error);
  }
}

/**
 * Get user by user _id
 * @param {objectId} _id The user _id
 * @returns {Promise.<{id: *}>} Return user or an error
 */
export async function getUserProfile(_id) {
  console.log('getUserProfile:', _id);
  try {
    let user = await User.findByPk(_id);
    user = user.toJSON();
    return user;
  } catch (error) {
    logger.error(`UserService getUserProfile error: ${error}`);
    throw error;
  }
}

/**
 * Get user by user query
 * @param {object} query The mongo query
 * @returns {Promise.<{id: *}>} Return user or an error
 */
export async function getUser(query) {
  try {
    return await User.findOne({ where: query });
  } catch (error) {
    logger.error(`UserService getUser error: ${error}`);
    throw error;
  }
}

/**
 * Update the existed user
 * @param user
 * @param user._id
 * @param user.fullName
 * @param user.email
 * @param user.phone
 * @param data
 * @param data.fullName
 * @param data.email
 * @param data.phone
 * @param data.identityCards
 * @returns {Promise<*>}
 * Todo: resend email verify if change email
 */
export async function updateUserProfile(user, data) {
  try {
    const {
      email,
    } = data;
    if (user.email !== email) {
      const userHasEmail = await User.findOne({ where: { email: email } });
      if (userHasEmail) {
        throw new APIError(403, [
          {
            msg: 'Email is not available',
            param: 'emailNotAvailable',
          },
        ]);
      }
    }
    const updateFields = {};
    const updateSetFields = ['fullName', 'email', 'phone', 'avatar'];
    updateSetFields.forEach((setField) => {
      if (data[setField]) {
        updateFields[setField] = data[setField];
      }
    });
    if (Object.keys(updateFields).length > 0) {
      await User.update(updateFields, { where: { id: user.id } });
      return true;
    }
    throw new APIError(304, 'Not Modified');
  } catch (error) {
    logger.error(`User updateUserProfile error: ${error}`);
    throw error;
  }
}

/**
 * Update user password
 * @param user User model instance
 * @param params
 * @param params.oldPassword
 * @param params.newPassword
 * @returns {Promise<*>}
 */
export async function updateUserPassword(user, params) {
  try {
    const { oldPassword, newPassword } = params;
    if (oldPassword === newPassword) {
      throw new APIError(403, [
        {
          msg: 'New password must be difference with old password',
          param: 'passwordNotChanged',
        },
      ]);
    }
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      throw new APIError(403, [
        {
          msg: 'Password is not correct',
          param: 'passwordIncorrect',
        },
      ]);
    }
    user.password = bcrypt.hashSync(newPassword, BCRYPT_SALT_ROUNDS);
    await user.save();
    return true;
  } catch (error) {
    // console.log(error);
    // logger.error(`User updateUserPassword error: ${error}`);
    if (error instanceof APIError) {
      throw error; // giữ nguyên mã lỗi gốc (ví dụ 403)
    }
    
  }
}

/**
 * Create new user
 * @param params
 * @param params.password
 * @param params.fullName
 * @param params.email
 * @param params.role
 * @returns {Promise<boolean>}
 */
export async function createUser(params) {
  try {
    const userOwnEmail = await User.findOne({ where: { email: params.email } });
    if (userOwnEmail) {
      throw new APIError(403, [
        {
          msg: 'Email is not available',
          param: 'emailNotAvailable',
        },
      ]);
    }
    await User.create({
      email: params.email,
      fullName: params.fullName,
      password: bcrypt.hashSync(params.password, BCRYPT_SALT_ROUNDS),
      role: params.role,
    });
    return true;
  } catch (error) {
    logger.error(`UserService createUser error: ${error}`);
    throw error;
  }
}


/**
 * Get users
 * @param {object} params
 * @param {number} params.page
 * @param {number} params.rowPerPage
 * @param {string} params.rowPerPage
 * @returns {Promise<void>}
//  */
export async function adminGetUsers(params) {
  try {
    const { page, rowPerPage } = params;
    let textSearch = params.textSearch;
    let currentPage = Number(page || 1);
    if (currentPage < 1) {
      currentPage = 1;
    }
    let pageLimit = Number(rowPerPage || DEFAULT_PAGE_LIMIT);
    if (pageLimit > MAX_PAGE_LIMIT || pageLimit < 1) {
      pageLimit = DEFAULT_PAGE_LIMIT;
    }
    const offset = (currentPage - 1) * pageLimit;

    const queryConditions = {
      // role: USER_ROLES.USER,
    };
    if (typeof textSearch === 'string') {
      textSearch = textSearch.replace(/\\/g, String.raw`\\`);
      queryConditions.accountName = { [Op.like]: `%${textSearch}%` };
    }
    const totalItems = await User.count({ where: queryConditions });
    const data = await User.findAll({
      where: queryConditions,
      offset: offset,
      limit: pageLimit,
      order: [['createdAt', 'DESC']],
    });
    return {
      data: data,
      currentPage: currentPage,
      totalPage: Math.ceil(totalItems / pageLimit),
      totalItems: totalItems,
    };
  } catch (error) {
    logger.error(`UserService getUsers, error: ${error}`);
    throw error;
  }
}
/**
 * Get users
 * @param {object} params
 * @param {number} params.page
 * @param {number} params.rowPerPage
 * @param {string} params.rowPerPage
 * @returns {Promise<void>}
//  */
export async function GetSupervisorUsers(params) {
  try {
    const { page, rowPerPage } = params;
    let textSearch = params.textSearch;
    let currentPage = Number(page || 1);
    if (currentPage < 1) {
      currentPage = 1;
    }
    let pageLimit = Number(rowPerPage || DEFAULT_PAGE_LIMIT);
    if (pageLimit > MAX_PAGE_LIMIT || pageLimit < 1) {
      pageLimit = DEFAULT_PAGE_LIMIT;
    }
    const offset = (currentPage - 1) * pageLimit;

    const queryConditions = {
      role: USER_ROLES.SUPERVISOR,
    };
    if (typeof textSearch === 'string') {
      textSearch = textSearch.replace(/\\/g, String.raw`\\`);
      queryConditions.accountName = { [Op.like]: `%${textSearch}%` };
      queryConditions.role = { [Op.eq]: USER_ROLES.SUPERVISOR };
    }
    const totalItems = await User.count({ where: queryConditions });
    const data = await User.findAll({
      where: queryConditions,
      offset: offset,
      limit: pageLimit,
      order: [['createdAt', 'DESC']],
    });
    return {
      data: data,
      currentPage: currentPage,
      totalPage: Math.ceil(totalItems / pageLimit),
      totalItems: totalItems,
    };
  } catch (error) {
    logger.error(`UserService getUsers, error: ${error}`);
    throw error;
  }
}

/**
 * Update user password
 * @param user User model instance
 * @param params
 * @param params.oldPassword
 * @param params.newPassword
 * @returns {Promise<*>}
 */
export async function forgotPassword(email) {
  try {
    const existedUser = await User.findOne({ where: { email: email } });
    if (!existedUser) {
      throw new APIError(403, 'Email is not available');
    }
    const verifyCode = Math.floor(10000000 + Math.random() * 90000000).toString();
    console.log("verifyCode", verifyCode)
    existedUser.verifyCode = verifyCode;
    await existedUser.save();
    await triggerSentMailEvent({
      email: email,
      template: "ForgotPassWord",
      dataSubmit: {
        accountName: existedUser.accountName,
        descriptions: "Reset password",
        userCreate: existedUser.accountName,
        name: "Reset password",
        descriptions: verifyCode,
      }
    });

  } catch (error) {
    logger.error(`User updateUserPassword error: ${error}`);
    throw error;
  }
}


export async function verifyForgotPasswordCode(verifyCode, email) {
  try {
    const existedUser = await User.findOne({ where: { verifyCode: verifyCode } });
    if (!existedUser) {
      throw new APIError(403, 'Code is not available');
    }
    const newPassword = crypto.randomBytes(8).toString("base64").replace(/[^a-zA-Z0-9]/g, "").slice(0, 8);
    existedUser.password = bcrypt.hashSync(newPassword, BCRYPT_SALT_ROUNDS);
    existedUser.verifyCode = null;
    await existedUser.save();

    await triggerSentMailEvent({
      email: email,
      template: "VerifyForgotPasswordCode",
      dataSubmit: {
        accountName: existedUser.accountName,
        descriptions: newPassword,
        userCreate: existedUser.accountName,
        name: "New password",
      }
    });

  } catch (error) {
    logger.error(`User updateUserPassword error: ${error}`);
    throw error;
  }
}

export async function updateUserProfileById(id, data) {
  try {
    const updateFields = {};
    const updateSetFields = ['email'];
    updateSetFields.forEach((setField) => {
      if (data[setField]) {
        updateFields[setField] = data[setField];
      }
    });
    if (Object.keys(updateFields).length > 0) {
      await User.update(updateFields, { where: { id } });
      return true;
    }
    throw new APIError(304, 'Not Modified');
  } catch (error) {
    logger.error(`User updateUserProfileById error: ${error}`);
    throw error;
  }
}