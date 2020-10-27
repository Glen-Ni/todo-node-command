const homedir = require('os').homedir();
const fs = require('fs');
const path = require('path')

const dbPath = path.join(homedir, 'todo.txt')

const db = {
  read: (dbpath = dbPath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(dbpath, { flag: 'a+' }, (err, data) => {
        if (err) { return reject(err) }
        let list;
        try {
          list = JSON.parse(data.toString());
        } catch (error) {
          list = [];
        }
        resolve(list);
      });
    });
  },
  write: (arr, dbpath = dbPath) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(dbpath, JSON.stringify(arr), err => {
        if(err) return reject(err);
        return resolve;
      });
    });
  }
}

module.exports = db;
