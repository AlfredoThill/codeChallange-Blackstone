const express = require('express');
const userController = require('../controllers/c-user');
const router = express.Router();

router.get('/checkStatus', userController.checkStatus);
router.post('/login', userController.login);
router.post('/sign', userController.signIn);
router.get('/out', userController.out);
router.get('/confirm', userController.confirmAccount);
router.post('/reset-pwd', userController.resetPwd);
router.get('/confirm-reset', userController.confirmReset);
router.put('/pwd-change', userController.pwdChange);


module.exports = router;