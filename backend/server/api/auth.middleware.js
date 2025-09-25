import jwt from 'jsonwebtoken';
import APIError from '../util/APIError';
import { USER_JWT_SECRET_KEY } from '../config';
import User from '../components/user/user.model';
import { USER_ROLES } from '../constants';
import rateLimit from 'express-rate-limit';

// import User from '../components/user/user.model';

/**
 * Validate user account
 * @returns {function(*, *, *)}
 */
export function isAuthorized(secret = null) {
  return async (req, res, next) => {
    // console.log('req.path: ', req.path)

    const authorization = req.header('Authorization');
    if (typeof authorization !== 'string') {
      if (req.path === '/execute-flow') {
        return next();
      }
      return next(new APIError(401, 'Unauthorized'));
    }

    const authorizationArray = authorization.split(' ');
    if (authorizationArray[0] === 'Bearer') {
      const token = authorizationArray[1];
      let userData;
      try {
        userData = jwt.verify(token, secret || USER_JWT_SECRET_KEY);
        // console.log('userData: ', userData);

      } catch (error) {
        if (req.path === '/execute-flow') {
          return next();
        }
        return next(new APIError(401, 'Unauthorized'));
      }
      try {
        req.auth = await User.findByPk(userData._id);
        // console.log('isAuthorized: ', req.auth);

        if (!req.auth) {
          console.log('Unauthorized')
          if (req.path === '/execute-flow') {
            return next();
          }
          return next(new APIError(401, 'Unauthorized'));
        }
        // console.log('Authorized')

        return next();
      } catch (error) {
        console.log('here ---- ', error)
        return next(new APIError(500, 'Internal Server Error'));
      }
    }
    return next(new APIError(401, 'Unauthorized'));
  };
}

/**
 * Validate admin account
 * @returns {function(*, *, *)}
 */
export function isAdmin() {
  return async (req, res, next) => {
    const authorization = req.header('Authorization');
    if (typeof authorization !== 'string') {
      return next(new APIError(401, 'Unauthorized - 1'));
    }
    const authorizationArray = authorization.split(' ');
    if (authorizationArray[0] === 'Bearer') {
      const token = authorizationArray[1];
      let userData;
      try {
        userData = jwt.verify(token, USER_JWT_SECRET_KEY);
      } catch (error) {
        return next(new APIError(401, 'Unauthorized - 2'));
      }
      try {
        const user = await User.findByPk(userData._id);
        // console.log(user);
        if (!user || user.role !== 'ADMIN') {
          return next(new APIError(401, 'Unauthorized - 3'));
        }
        req.auth = user;
        return next();
      } catch (error) {
        console.log(error)
        return next(new APIError(500, 'Internal Server Error'));
      }
    }
    return next(new APIError(401, 'Unauthorized - 4'));
  };
}
export function isSupervisorOrAdmin() {
  return async (req, res, next) => {
    const authorization = req.header('Authorization');
    if (typeof authorization !== 'string') {
      return next(new APIError(401, 'Unauthorized - 1'));
    }
    const authorizationArray = authorization.split(' ');
    if (authorizationArray[0] === 'Bearer') {
      const token = authorizationArray[1];
      let userData;
      try {
        userData = jwt.verify(token, USER_JWT_SECRET_KEY);
      } catch (error) {
        return next(new APIError(401, 'Unauthorized - 2'));
      }
      try {
        console.log("userData=====", userData);
        const user = await User.findByPk(userData._id);

        if (!user || (user.role !== USER_ROLES.SUPERVISOR && user.role !== USER_ROLES.ADMIN)) {
          return next(new APIError(401, 'Unauthorized - 3'));
        }
        req.auth = user;
        return next();
      } catch (error) {
        console.log(error)
        return next(new APIError(500, 'Internal Server Error'));
      }
    }
    return next(new APIError(401, 'Unauthorized - 4'));
  };
}
export function isSupervisor() {
  return async (req, res, next) => {
    const authorization = req.header('Authorization');
    if (typeof authorization !== 'string') {
      return next(new APIError(401, 'Unauthorized - 1'));
    }
    const authorizationArray = authorization.split(' ');
    if (authorizationArray[0] === 'Bearer') {
      const token = authorizationArray[1];
      let userData;
      try {
        userData = jwt.verify(token, USER_JWT_SECRET_KEY);
      } catch (error) {
        return next(new APIError(401, 'Unauthorized - 2'));
      }
      try {
        console.log("userData=====", userData);
        const user = await User.findByPk(userData._id);

        if (!user || user.role !== USER_ROLES.SUPERVISOR) {
          return next(new APIError(401, 'Unauthorized - 3'));
        }
        req.auth = user;
        return next();
      } catch (error) {
        console.log(error)
        return next(new APIError(500, 'Internal Server Error'));
      }
    }
    return next(new APIError(401, 'Unauthorized - 4'));
  };
}
/**
 * Validate user account but not required
 * @returns {function(*, *, *)}
 */
export function passUserAuth() {
  return async (req, res, next) => {
    const authorization = req.header('Authorization');
    if (typeof authorization !== 'string') {
      return next();
    }
    const authorizationArray = authorization.split(' ');
    if (authorizationArray[0] === 'Bearer') {
      const token = authorizationArray[1];
      let userData;
      try {
        userData = jwt.verify(token, USER_JWT_SECRET_KEY);
      } catch (error) {
        return next();
      }
      try {
        req.auth = await User.findByPk(userData._id); // Thay đổi từ User.findById sang User.findByPk
        return next();
      } catch (error) {
        return next();
      }
    }
    return next();
  };
}

export function limitRequest(maxRequests, minutes) {
  return rateLimit({
    windowMs: minutes * 60 * 1000, // Thời gian tính bằng mili-giây (1 phút = 60,000 ms)
    max: maxRequests, // Số lần request tối đa trong khoảng thời gian
    message: {
      status: 'error',
      message: `Bạn đã vượt quá ${maxRequests} yêu cầu trong ${minutes} phút. Vui lòng thử lại sau.`,
    },
    keyGenerator: (req) => req.ip, // Giới hạn dựa trên IP của client
  });
}