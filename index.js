const db = require('./db');
const inquirer = require('inquirer')


// printtodo
function printTodos(list) {
  inquirer.prompt({
        type: 'list',
        name: 'index',
        message: '请选择需要操作的内容：',
        choices: [
          { name: '+ 添加任务', value: '-1' },
          { name: '退出', value: '-3' },
          new inquirer.Separator(),
          ...list.map((todo, index) => ({
            name: `${index + 1} ${todo.completed ? '[X]' : '[_]'} ${todo.title}`,
            value: index
          })),
          new inquirer.Separator(),
          { name: '清空', value: '-2' }
        ],
      })
    .then(answer => {
      if (answer.index === '-2') {
        clear();
        return
      } else if (answer.index === '-1') {
        addTodo(list);
        return
      } else if (answer.index === '-3') {
        return
      }
      askForTodoActions(list, parseInt(answer.index));
    })
}

// 添加todo
function addTodo(list) {
  inquirer.prompt({
      type: 'input',
      name: 'title',
      message: '请编辑输入标题：',
    }).then(async answer => {
    await db.write([
      ...list,
      {
        title: answer.title,
        completed: false
      }
    ]);
  })
}

// 问询todo操作
function askForTodoActions(list, index) {
  const actionList = {
    toogleComplete,
    deleteTodo,
    editTodo
  }
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: '请选择需要的操作：',
    choices: [
      { name: list[index].completed ? '设为未完成' : '设为完成', value: 'toogleComplete' },
      { name: '改标题', value: 'editTodo' },
      { name: '删除', value: 'deleteTodo' },
      { name: '退出', value: 'quit' }
    ]
  })
    .then(answer => {
      actionList[answer.action](list, index);
    })
}



// 清空
async function clear(list) {
  await db.write([])
}

// 切换完成
async function toogleComplete(list, index) {
  const list2 = JSON.parse(JSON.stringify(list));
  const { completed } = list2[index];
  list2[index].completed = !completed;
  await db.write(list2);
}

// 删除
async function deleteTodo(list, index) {
  const list2 = JSON.parse(JSON.stringify(list));
  list2.splice(index);
  await db.write(list2)
}

// 编辑
async function editTodo(list, index) {
  inquirer.prompt({
    type: 'input',
    name: 'title',
    message: '请编辑标题：',
    default: list[index].title
  }).then(async answer => {
    list[index].title = answer.title;
    await db.write(list);
  })
}

module.exports.addTodo = async (title) => {
  const list = await db.read();
  list.push({ title, completed: false });
  await db.write(list);
}

module.exports.showAll = async () => {
  const list = await db.read();
  printTodos(list)
}