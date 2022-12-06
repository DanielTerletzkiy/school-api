import { Router } from 'express';
import jetValidator from 'jet-validator';

import adminMw from './shared/adminMw';
import {User} from '.prisma/client';
import authRoutes from './auth-routes';
import userRoutes from './user-routes';


// **** Init **** //

const apiRouter = Router(),
  validate = jetValidator();


// **** Setup auth routes **** //

const authRouter = Router();

// Login user
authRouter.post(
  authRoutes.paths.login,
  validate('email', 'password'),
  authRoutes.login,
);

// Logout user
authRouter.get(authRoutes.paths.logout, authRoutes.logout);

// Add authRouter
apiRouter.use(authRoutes.paths.basePath, authRouter);


// **** Setup user routes **** //

const userRouter = Router();

// Get all users
userRouter.get(userRoutes.paths.get, userRoutes.getAll);

// Add one user
userRouter.post(
  userRoutes.paths.add,
  userRoutes.add,
);

// Update one user
userRouter.put(
  userRoutes.paths.update,
  userRoutes.update,
);

// Delete one user
userRouter.delete(
  userRoutes.paths.delete,
  userRoutes.delete,
);

// Add userRouter
apiRouter.use(userRoutes.paths.basePath, adminMw, userRouter);


// **** Export default **** //

export default apiRouter;
