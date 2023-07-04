const express = require('express')
const http = require('http');
const { Sequelize } = require('sequelize');

const app = express()
const hostname = '127.0.0.1';
const port = 3000;

const mysql = require('mysql2');

// create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'sitepoint'
});

// simple query
// connection.query(
//   'SELECT NAME FROM AUTHORS',
//   function(err, results, fields) {
//     console.log(results); // results contains rows returned by server
//     // console.log(fields); // fields contains extra meta data about results, if available
//   }
// );

const sequelize = new Sequelize('sitepoint', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });


sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

sequelize.sync({ alter: true });
console.log("All models were synchronized successfully.");

app.get('/home', (req, res) => {
  res.send('hello world')
})


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/home`);
});

