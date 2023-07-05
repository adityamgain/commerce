const express = require('express');
const bodyParser = require('body-parser');
const path=require('path');
const {Sequelize, DataTypes} = require("sequelize");
// const mysql = require('mysql2');
const db = require('./models/user');
const User  = require('./models/user');
const Items  = require('./models/product');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const hostname = 'localhost';
const port = 3000;

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');


// create the connection to database
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'commerce'
// });

const sequelize = new Sequelize(
  'commerce',
  'root',
  '',
   {
     host: 'localhost',
     dialect: 'mysql'
   }
 );

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

sequelize.sync({ alter: true });
console.log("All models were synchronized successfully.");

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/products',async (req, res) => {
  const products= await Items.findAll();
  res.render('prod',{products})
});

app.get('/add',(req,res)=>{
  res.render('newproduct')
});

app.post('/products',async(req,res)=>{
  try{
  const { name, price, img }= req.params;
  const data= await Items.create({
    name,
    price,
    img,
    timestamp: new Date().toISOString()
  });
  console.log("product added")
  res.redirect('/products');
}catch(error){
  console.log(error);
}
});


app.get('/signin',async (req,res)=>{
  // await User.create({
  //   firstName: 'hoyaa',
  //   lastName: 'josu',
  //   email: 'nviev@nrf'
  // }).catch(err=>{
  //   if(err){
  //     console.log(err)
  //   }
  // });
  res.render('signin')
});

app.get('/insert',async (req,res)=>{
  await Items.create({
    name: 'wood',
    img: 'foijnfeiruf.jpn',
    price: 43
  }).catch(err=>{
    if(err){
      console.log(err)
    }
  });
});

// db.sequelize.sync().then((req)=>{
  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
// });

