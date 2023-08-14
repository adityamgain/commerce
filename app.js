const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path=require('path');
const {Sequelize, DataTypes} = require("sequelize");
const passport = require("passport");
const expressSession=require("express-session");
// const mysql = require('mysql2');
const db = require('./models/user');
const User  = require('./models/user');
const Items  = require('./models/product');
const  OrderItem  = require('./models/orders');
const Order= require('./models/orders');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { isAuthenticated } = require('./authenticate');
const axios = require('axios');
const cors = require('cors');

//config keys 
const publicKey = 'test_public_key_da5c0932208b4b9285bcec5c51fde5ed';
const secretKey = 'test_secret_key_0a7d45e1280a4a1ab43d040b6b949524';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({secret:"secret", resave:false, saveUninitialized:false}));
app.use(methodOverride('_method'));


const hostname = 'localhost';
const port = 3000;

app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

// database connection
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


//home page
app.get('/', (req, res) => {
  res.render('home')
});

// all products listed page
app.get('/products',async (req, res) => {
  const products= await Items.findAll();
  res.render('prod',{products})
});

// Autheniticate middleware
app.get('/add', (req,res)=>{    
  res.render('newproduct')
});

// add new product
app.post('/products',async(req,res)=>{
  try{
  const { name, price, img }= req.body;
  const data= await Items.create({
    name,
    price,
    img,
    timestamp: new Date().toISOString()
  });
  res.redirect('/products');
}catch(error){
  console.log(error);
}
});

// view more product detail
app.get('/products/:id',async(req,res)=>{
  const itemId= req.params.id;
  const data=await Items.findByPk(itemId);
  res.render('info',{ data });
});

// edit product details
app.get('/products/:id/edit',async(req,res)=>{
  const itemId= req.params.id;
  const data=await Items.findByPk(itemId);
  res.render('edit',{ data });
});

app.put('/products/:id',async(req,res)=>{
  const itemId= req.params.id;
  const{ name, price, img}= req.body;
  const [numRowsUpdated]= await Items.update(
    { name, price, img},{
    where:{
      id:itemId
    },returning:true
  });
  if (numRowsUpdated === 0) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.redirect(`/products/${itemId}`);
});


// delete product
app.delete('/products/:id',async(req,res)=>{
  const itemId=req.params.id;
  await Items.destroy({
    where:{
      id:itemId
    }
  })
  res.redirect('/products');
});

// adding new orders into database
app.post('/orders', async(req,res)=>{
  const response = req.body.paymentResponse; 
  const orders = await OrderItem.create({
    orderID: response.idx,
    itemID: response.product_identity,
    itemName: response.product_name,
    price: response.amount/100,
    quantity: 2
  });
});

// verifying payment 
app.get('/payment/:id', async(req, res) => {
  const itemId = req.params.id;
  const data = await Items.findByPk(itemId);
  res.render('payment_form',{data, publicKey, secretKey });
});

app.get('/success', (req,res)=>{
  res.render('orderSuccess');
});


// app.get('/payment-verify', async (req, res) => {
//   const token = req.query.token;
//   const amount = req.query.price;
//   const data = {
//     token: token,
//     amount: amount
//   };
//   const config = {
//     headers: { 
//       'Authorization': 'Key ' + secretKey, 
//       'Content-Type': 'application/json'
//   }};
//     try {
//       const response = await axios.post("https://khalti.com/api/v2/payment/verify/", data, config);
//       console.log(response.data);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ status: 'error', message: 'Payment verification failed' });
//     }
//   });

// app.get('/orders', (req,res)=>{
//   // res.send('order page');
//   const orderDetails = { orderId: 123, itemName: 'Sample Item', price: 1000 };
//   res.status(200).json(orderDetails);
// });



// signin function
app.get('/signin',async(req,res)=>{
  res.render('signin');
});

// signing in 
app.post('/signin', async (req, res) => {
  const { Name, userName, email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (user) {
      return res.status(400).send("User already exists");
    }
    bcrypt.genSalt(saltRounds, async (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const data = await User.create({
          Name,
          userName,
          email,
          password: hash,
          timestamp: new Date().toISOString()
        });
        res.redirect('/');
      });
    });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});


// login function
app.get('/login',(req,res)=>{
  res.render('login');
});

// logging in 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.redirect('/signin');
    }
    if (!user.password) {
      return res.status(500).send("User data is invalid");
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (passwordsMatch) {
      return res.redirect('/products');
    } else {
      return res.redirect('/login');
    }
  } catch (error) {
    console.error("Error while handling '/login' request:", error);
    res.redirect('/login');
  }
});

// starting server on port 3000
app.listen(port, hostname, () => {
 console.log(`Server running at http://${hostname}:${port}/`);
});

