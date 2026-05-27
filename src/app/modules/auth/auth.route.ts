import express from 'express';
import { AuthControllers } from './auth.controller';

const router: import("express").Router = express.Router();

router.post('/login', AuthControllers.loginUser);
router.post('/refresh-token', AuthControllers.refreshToken);

export const AuthRoutes = router;
