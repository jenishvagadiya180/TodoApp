import express from 'express';
const router = express.Router();
import { User } from '../controllers';
import { body } from 'express-validator';
import { services} from '../helper';
const send = services.setResponse;

router.post(
  '/addUser',
  [
    body('username')
      .exists()
      .isLength({ min: 2 })
      .withMessage('Invalid username'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/[a-z]/)
      .withMessage('Password must contain at least one lowercase letter')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/)
      .withMessage('Password must contain at least one number')
      .matches(/[@$!%*?&#]/)
      .withMessage('Password must contain at least one special character')
  ],
  User.addUser
);

router.post(
  '/login',
  [
    body('username')
      .exists()
      .isLength({ min: 2 })
      .withMessage('Invalid username'),
    body('password')
      .exists()
      .isLength({ min: 8 })
      .withMessage('Invalid Password')
  ],
  User.userLogin
);

export default router;
