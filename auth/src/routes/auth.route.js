const express = require('express');
const validator = require("../middlewares/validator.middleware")
const authController = require('../controller/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const passport = require('passport');


const router = express.Router();

router.post('/register', validator.registerUserValidator, authController.RegisterUser);


router.post('/login', validator.loginUserValidator, authController.LoginUser);

// Route to initiate Google OAuth flow
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route that Google will redirect to after authentication
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleOAuthCallback);


router.get('/me', authMiddleware.authMiddleware, authController.GetCurrentUser);


router.get('/logout', authController.LogoutUser)

// Addresses
router.get('/users/me/addresses', authMiddleware.authMiddleware, authController.getUserAddresses);
router.post('/users/me/addresses', authMiddleware.authMiddleware, authController.addUserAddress);
router.delete('/users/me/addresses/:addressId', authMiddleware.authMiddleware, authController.deleteUserAddress);



module.exports = router;
