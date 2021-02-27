const express = require('express');
const taskController = require('../controllers/c-task');
const router = express.Router();

router.get('/list', taskController.fetchTasks);
router.post('/create', taskController.createTask);
router.put('/update', taskController.updateTask);
router.put('/mark', taskController.markCompleted);
router.put('/destroy', taskController.destroyTask);

module.exports = router;