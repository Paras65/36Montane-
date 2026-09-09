const express = require('express');
const { register, login, getMe, changePassword } = require('../controller/authController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
