const express = require('express');
const taskController = require('../controllers/c-task');
const router = express.Router();

router.get('/tasks/list', taskController.fetch);
router.post('/tasks/create', taskController.create);
router.put('/tasks/update', taskController.update);
router.delete('/tasks/destroy', taskController.destroy);

module.exports = router;