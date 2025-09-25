/**
 * The final error handler for api call
 * @param {Error} error the error from prev middleware
 * @param req
 * @param res
 * @param next
 */
import logger from '../util/logger';

// eslint-disable-next-line no-unused-vars
export default function (error, req, res, next) {

  console.log(error)
  if (!error.statusCode) {
    logger.error(error.stack);
  }
  const statusCode = error.statusCode || 500;
  // console.log(" =  = = = = = = ")

  let payload = null;
  if (statusCode === 403) {
    payload = error.message || error.errors
  } else {
    payload = 'Internal server error'
  }

  // upload error
  if (statusCode === 422) {
    payload = error?.errors[0]?.msg
    // res.status(statusCode).json(error?.errors[0]);
  }

  // console.log('zzz error: ', error.errors[0].msg)
  // console.log('ERR payload: ', payload)
  // const payload = statusCode === 500 ? error.message || error.errors : 'Internal server error';

  if (typeof payload === 'string') {
    res.status(statusCode).send(payload);
  } else {
    res.status(statusCode).json({
      success: false,
      ...payload
    });
  }
}
