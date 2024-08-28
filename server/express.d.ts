// express.d.ts
import { User } from './src/models/user.model.js';

declare module 'express' {
  export interface Request {
    user?: User;
  }
}
