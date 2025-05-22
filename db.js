const mysql = require("mysql");
const isProduction = process.env.NODE_ENV === 'production'

const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
}

// ADD MySQL sock path in production
if(isProduction){
  poolConfig.socketPath = '/var/run/mysqld/mysqld.sock'
}

const pool = mysql.createPool(poolConfig);

const query = (query, parameter) => {
  return new Promise((resolve, reject) => {
    pool.query(query, parameter, (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
};

module.exports = {
  query,
  pool,
};
