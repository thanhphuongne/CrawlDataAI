import jwt from 'jsonwebtoken';
import APIError from '../../util/APIError';
import { USER_JWT_SECRET_KEY } from '../../config';
import AIUser from './user.model';

/**
 * Validate AI user account
 * @returns {function(*, *, *)}
 */
export function isAIAuthorized() {
  return async (req, res, next) => {
    const authorization = req.header('Authorization');
    if (typeof authorization !== 'string') {
      return next(new APIError(401, 'Unauthorized'));
    }

    const authorizationArray = authorization.split(' ');
    if (authorizationArray[0] === 'Bearer') {
      const token = authorizationArray[1];
      let userData;
      try {
        userData = jwt.verify(token, USER_JWT_SECRET_KEY);
      } catch (error) {
        return next(new APIError(401, 'Unauthorized'));
      }
      try {
        req.auth = await AIUser.findByPk(userData._id);
        if (!req.auth) {
          return next(new APIError(401, 'Unauthorized'));
        }
        return next();
      } catch (error) {
        return next(new APIError(500, 'Internal Server Error'));
      }
    }
    return next(new APIError(401, 'Unauthorized'));
  };
}