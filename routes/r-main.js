const express = require('express');
const mainController = require('../controllers/c-main');
const router = express.Router();

router.get('/', mainController.index);
router.get('/component', mainController.component);

module.exports = router;