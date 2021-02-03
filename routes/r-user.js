const express = require('express');
const userController = require('../controllers/c-user');
const router = express.Router();

router.get('/user/checkStatus', userController.checkStatus);
router.post('/user/login', userController.login);
router.post('/user/sign', userController.signIn);
router.get('/user/out', userController.out);
router.get('/user/confirm', userController.confirmAccount);
router.post('/user/reset-pwd', userController.resetPwd);
router.get('/user/confirm-reset', userController.confirmReset);
router.put('/user/pwd-change', userController.pwdChange);


module.exports = router;