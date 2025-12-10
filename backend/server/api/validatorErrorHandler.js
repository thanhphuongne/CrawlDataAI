import { validationResult } from 'express-validator';
import logger from '../util/logger';
/**
 * @swagger
 * definitions:
 *   ValidatorErrorItem:
 *     type: object
 *     properties:
 *       value:
 *         type: string
 *         description: The value got on request
 *       msg:
 *         type: string
 *         description: The error message
 *       param:
 *         type: string
 *         description: The key of value
 *       location:
 *         type: string
 *         description: The location of value
 */

/**
 * @swagger
 * definitions:
 *   ValidatorError:
 *     type: object
 *     properties:
 *       success:
 *         type: boolean
 *       errors:
 *         type: array
 *         items:
 *           $ref: "#/definitions/ValidatorErrorItem"
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: string
 *         description: Unique identifier for the user
 *       firstName:
 *         type: string
 *         description: first Name of the user
 *       lastName:
 *         type: string
 *         description: last Name of the user
 *       email:
 *         type: string
 *         description: Email address of the user
  *   Category:
 *     type: object
 *     properties:
 *       name:
 *         type: string
 *         description: The name of the category
 *       description:
 *         type: string
 *         description: A short description of the category
 *       score:
 *         type: number
 *         format: float
 *         description: The score associated with the category
 *       type:
 *         type: string
 *         description: The type of the category
 */


 
export default function validatorErrorHandler(req, res, next) {
  // Finds the validation errors in this request
  // and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const arrayErrors = Object.values(errors.mapped());
    arrayErrors.forEach((error) => {
      const msg = error.msg;
      if (typeof msg === 'string') {
        error.msg = res.__(error.msg) || error.msg;
      } else if (msg instanceof Array) {
        try {
          error.msg = res.__(error.msg[0], ...error.msg[1]) || error.msg;
        } catch (e) {
          logger.error('validatorErrorHandler set language failed:');
          logger.error(error.msg);
          logger.error(e);
        }
      }
      error.msg = res.__(error.msg) || error.msg;
    });
    return res.status(422).json({
      success: false,
      message: arrayErrors[0]?.msg || 'Validation failed',
      errors: arrayErrors,
    });
  }
  return next();
}
