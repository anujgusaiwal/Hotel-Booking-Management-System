import { body, validationResult } from 'express-validator';

export const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors for frontend
    const errorMessages = errors.array().map(err => err.msg);
    res.status(400).json({ 
      message: errorMessages[0] || 'Validation failed',
      errors: errors.array() 
    });
  };
};

export const registerValidation = [
  body('full_name').trim().notEmpty().withMessage('Full name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').optional().trim()
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

export const roomValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('price_per_night').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('features').optional().isObject().withMessage('Features must be an object')
];

export const bookingValidation = [
  body('room_id').isInt({ min: 1 }).withMessage('Valid room ID is required'),
  body('from_date').isISO8601().withMessage('Valid check-in date is required'),
  body('to_date').isISO8601().withMessage('Valid check-out date is required'),
  body('guests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1')
];

