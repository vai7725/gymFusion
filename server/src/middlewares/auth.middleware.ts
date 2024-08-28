import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';
import { NextFunction, Request, Response } from 'express';

export interface DecodedToken extends JwtPayload {
  _id: string;
}

export const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new ApiError(401, 'Unauthorized request');
    }

    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as DecodedToken;
    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken -emailVerificationToken -emailVerificationExpiry'
    );
    if (!user) {
      // Client should make a request to /api/v1/users/refresh-token if they have refreshToken present in their cookie
      // Then they will get a new access token which will allow them to refresh the access token without logging out the user
      throw new ApiError(401, 'Invalid access token');
    }
    req.user = user;
    next();
  }
);
