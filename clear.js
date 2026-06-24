const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('db.sqlite');

db.run("DELETE FROM core_banking_transaction WHERE isMapped=0;", function(err) {
  if (err) {
    return console.error(err.message);
  }
  console.log(`Deleted ${this.changes} rows`);
  db.close();
});
