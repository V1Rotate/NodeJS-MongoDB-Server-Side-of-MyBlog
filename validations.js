import { body } from 'express-validator';

//validator is checking if the user registering with email, password... if the email is really email (format).
export const registerValidation = [
  body('email', 'Email wrong format').isEmail(),
  body('password', 'Password must consist of 5 symbols').isLength({ min: 5 }), // if password is less than 5  - it will user know.
  body('fullName', 'Are you sure that this is a full name?').isLength({
    min: 3,
  }),
  body('avatarUrl', 'Wrong URL type').optional().isURL(), //avatar is option, if its provided - it will be checked, if not - ok, so not checked.
];

export const loginValidation = [
  body('email', 'Email wrong format').isEmail(),
  body('password', 'Password must consist of 5 symbols').isLength({ min: 5 }),
];

export const postCreateValidation = [
  body('title', 'Article header').isLength({ min: 3 }).isString(),
  body('text', 'Article text').isLength({ min: 3 }).isString(),
  body('tags', 'Wrong tags format').optional().isString(),
  body('imageUrl', 'Wrong link to the image').optional().isString(),
];
