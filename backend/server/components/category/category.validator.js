import { body, param } from 'express-validator';
import validatorErrorHandler from '../../api/validatorErrorHandler';

export const createCategory = [
    body('name').isLength({ min: 1 }).withMessage('Category name is required'),
    body('type').isLength({ min: 1 }).withMessage('type name is required'),
    body('approver').isLength({ min: 1 }).withMessage('approver is required'),
    body('description').isLength({ min: 1 }).withMessage('Description name is required'),
    body('score').isNumeric().withMessage('Score name is required'),
    validatorErrorHandler,
];
export const createTypeCategory = [
    body('type').isLength({ min: 1 }).withMessage('type name is required'),
    body('approver').isLength({ min: 1 }).withMessage('approver name is required'),
    validatorErrorHandler,
];
export const updateCategory = [
    body('name').isLength({ min: 1 }).withMessage('Category name is required'),
    body('type').isLength({ min: 1 }).withMessage('type name is required'),
    body('description').isLength({ min: 1 }).withMessage('Description name is required'),
    body('approver').isLength({ min: 1 }).withMessage('approver is required'),
    body('score').isNumeric().withMessage('Score name is required'),
    validatorErrorHandler,
];


