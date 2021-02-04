const express = require('express');
const taskController = require('../controllers/c-task');
const router = express.Router();

router.get('/tasks/list', taskController.fetchTasks);
router.post('/tasks/create', taskController.createTask);
router.put('/tasks/update', taskController.updateTask);
router.put('/tasks/destroy', taskController.destroyTask);

module.exports = router;