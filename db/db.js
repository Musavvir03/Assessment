const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.resolve(process.cwd(), 'db', 'data.db'));

module.exports = db; 