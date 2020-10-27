const { Command } = require('commander');
const inquirer = require('inquirer');
const api = require('./index');
const program = new Command();
const db = require('./db');

program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');
program
  .command('addTodo')
  .description('print what I typed')
  .action((...args) => {
    const arr = args.slice(1)
    api.addTodo(arr[0][0]);
    // console.log(arr[0].join(' '));
  });

if (process.argv.length === 2 ) {
  api.showAll();
}

console.log('running');