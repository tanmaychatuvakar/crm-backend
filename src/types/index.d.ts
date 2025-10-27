import { ActiveUser } from './active-user.type';

declare module 'express-serve-static-core' {
  interface Request {
    user: ActiveUser;
  }
}
