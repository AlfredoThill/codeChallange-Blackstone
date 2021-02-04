const express = require('express');
const mainController = require('../controllers/c-main');
const router = express.Router();

router.get('/', mainController.getHome);
router.get('/about', mainController.getAbout);

module.exports = router;