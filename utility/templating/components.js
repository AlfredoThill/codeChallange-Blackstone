const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// tasks-list template
const taskListPath = path.join(__dirname, '..', '..', 'views', 'components','dinamic','task-list.hbs');
const taskList = fs.readFileSync(taskListPath, 'utf8');
const taskList_template = handlebars.compile(taskList);

module.exports = {
    task_list: taskList_template
}