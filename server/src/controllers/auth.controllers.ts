// NOTE: Every controller should be wrapped inside the async handler for the consistency of code and request response cycle

import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import User from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
} from '../utils/mail.js';
import { cookieOptions } from '../constants';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { DecodedToken } from '../middlewares/auth.middleware';
import { uploadOnCloudinary } from '../utils/helpers';
import { UploadApiResponse } from 'cloudinary';
import fs from 'fs/promises';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

interface CustomRequest extends Request {
  file?: Express.Multer.File; // Assuming Multer is used for file upload
}

const generateAccessAndRefreshTokens = async (
  userId: string
): Promise<Tokens> => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(400, 'User not found');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
      throw new ApiError(500, 'Could not generate tokens');
    }

    // attach refresh token to the user document to avoid refreshing the access token with multiple refresh tokens
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      'Something went wrong while generating the access token'
    );
  }
};

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, phone, password } = req.body;

    if ([name, email, phone, password].some((val) => val === '')) {
      throw new ApiError(400, 'All fields are required');
    }

    const userAlreadyExists = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (userAlreadyExists) {
      throw new ApiError(
        400,
        'User already exist with this email or phone no.'
      );
    }

    const user = await User.create({
      ...req.body,
    });

    const { unHashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiration = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
      email: user.email,
      subject: 'Please verify your email',
      mailgenContent: emailVerificationMailgenContent(
        user.name,
        `${req.protocol}://${req.get(
          'host'
        )}/api/v1/auth/verify-email/${unHashedToken}`
      ),
    });

    const createdUser = await User.findById(user._id).select(
      '-password -refreshToken -emailVerificationToken -emailVerificationExpiry'
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        'Something went wrong while registering the user'
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: createdUser },
          'Verification email send on your email'
        )
      );
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, phone, password } = req.body;

  if ([email, phone, password].some((field) => field === '')) {
    throw new ApiError(400, 'All fields are required');
  }

  const user = await User.findOne({
    $or: [email, phone],
  });

  if (!user) {
    throw new ApiError(400, 'User does not exist with the email or phone no.');
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, 'Incorrect password');
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    String(user._id)
  );

  const loggedInUser = await User.findById(user._id).select(
    '-password -refreshToken -emailVerificationToken -emailVerificationExpiry'
  );

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        'User logged in successfully'
      )
    );
});

export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: '',
      },
    },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, {}, 'User logged out'));
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw new ApiError(400, 'Email verification token is missing');
  }

  let hashedToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(489, 'Token is invalid or expired');
  }
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiration = undefined;
  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, { isEmailVerified: true }, 'Email is verified'));
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, 'Unauthorized request');
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as DecodedToken;
      const user = await User.findById(decodedToken?._id);
      if (!user) {
        throw new ApiError(401, 'Invalid refresh token');
      }

      if (incomingRefreshToken !== user?.refreshToken) {
        throw new ApiError(401, 'Refresh token is expired or used');
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshTokens(String(user._id));

      return res
        .status(200)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', newRefreshToken, cookieOptions)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            'Access token refreshed'
          )
        );
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(401, error?.message || 'Invalid refresh token');
      } else {
        throw new ApiError(401, 'Invalid refresh token');
      }
    }
  }
);

export const forgotPasswordRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, 'User does not exists', []);
    }

    // Generate a temporary token
    const { unHashedToken, hashedToken, tokenExpiry } =
      user.generateTemporaryToken(); // generate password reset creds

    // save the hashed version a of the token and expiry in the DB
    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiration = tokenExpiry;
    await user.save({ validateBeforeSave: false });

    // Send mail with the password reset link. It should be the link of the frontend url with token
    await sendEmail({
      email: user?.email,
      subject: 'Password reset request',
      mailgenContent: forgotPasswordMailgenContent(
        user.name,
        // ! NOTE: Following link should be the link of the frontend page responsible to request password reset
        // ! Frontend will send the below token with the new password in the request body to the backend reset password endpoint
        `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`
      ),
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          'Password reset mail has been sent on your mail id'
        )
      );
  }
);

export const resetForgottenPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { resetToken } = req.params;
    const { newPassword } = req.body;

    // Create a hash of the incoming reset token

    let hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // See if user with hash similar to resetToken exists
    // If yes then check if token expiry is greater than current date

    const user = await User.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    // If either of the one is false that means the token is invalid or expired
    if (!user) {
      throw new ApiError(489, 'Token is invalid or expired');
    }

    // if everything is ok and token id valid
    // reset the forgot password token and expiry
    user.forgotPasswordToken = undefined;
    user.forgotPasswordTokenExpiration = undefined;

    // Set the provided password as the new password
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Password reset successfully'));
  }
);

export const changeCurrentPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user?._id);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // check the old password
    const isPasswordValid = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordValid) {
      throw new ApiError(400, 'Invalid old password');
    }

    // assign new password in plain text
    // We have a pre save method attached to user schema which automatically hashes the password whenever added/modified
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Password changed successfully'));
  }
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    return res
      .status(200)
      .json(
        new ApiResponse(200, req.user, 'Current user fetched successfully')
      );
  }
);

export const updateUserAvatar = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized request');
    }

    // Check if user has uploaded an avatar
    if (!req.file?.filename) {
      throw new ApiError(400, 'Avatar image is required');
    }

    const uploadedAvatar: UploadApiResponse = (await uploadOnCloudinary(
      req.file.filename,
      {
        folder: 'avatars',
        width: 500,
        height: 500,
        crop: 'fill',
        gravity: 'faces',
      }
    )) as UploadApiResponse;

    const user = await User.findById(req.user._id);

    let updatedUser = await User.findByIdAndUpdate(
      req.user._id,

      {
        $set: {
          // set the newly uploaded avatar
          avatar: {
            url: uploadedAvatar.url,
            public_id: uploadedAvatar.public_id,
            width: uploadedAvatar.width,
            height: uploadedAvatar.height,
          },
        },
      },
      { new: true }
    ).select(
      '-password -refreshToken -emailVerificationToken -emailVerificationExpiry'
    );

    // remove the old avatar
    fs.rm(req.file.filename);

    return res
      .status(200)
      .json(new ApiResponse(200, updatedUser, 'Avatar updated successfully'));
  }
);
