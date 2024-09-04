import {
  verifyEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  resetForgottenPassword,
  changeCurrentPassword,
  loginUser,
  logoutUser,
  registerUser,
  updateUserAvatar,
  getCurrentUser,
} from './../controllers/auth.controllers';
import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware';

const router = Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/logout').post(verifyJWT, logoutUser);

router.route('/verify-email/:verificationToken').post(verifyEmail);

router.route('/forgot-password').post(forgotPasswordRequest);

router.route('/reset-password/:resetToken').post(resetForgottenPassword);

router.route('/change-password').post(verifyJWT, changeCurrentPassword);

router.route('/refresh-token').post(refreshAccessToken);

router.route('/avatar').post(updateUserAvatar);

router.route('/current-user').post(getCurrentUser);

export default router;
