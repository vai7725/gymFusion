// package imports
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// module imports
import { BASEPATH } from './constants';
import { errorHandler } from './middlewares/error.middleware';
import { ApiResponse } from './utils/ApiResponse';

// router imports
import authRouters from './routes/auth.routes';
import facilityRouters from './routes/auth.routes';
import equipmentRouters from './routes/auth.routes';
import { ApiError } from './utils/ApiError';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swaggerConfig';

// constants

const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// test route
app.get(`${BASEPATH}/healthcheck`, (req: Request, res: Response) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, 'Everything is good!'));
  } catch (error: any) {
    throw new ApiError(500, error.message || 'Something went wrong');
  }
});

// api docs
app.use(`${BASEPATH}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// auth & user routes
app.use(`${BASEPATH}/auth`, authRouters);

// facilities routes
app.use(`${BASEPATH}/facility`, facilityRouters);

// equipment routes
app.use(`${BASEPATH}/equipment`, equipmentRouters);

// error middleware
app.use(errorHandler);

export { app };
