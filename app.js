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
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { isAuthenticated } = require('./authenticate');

const app = express();

// initializingPassport(passport);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({secret:"secret", resave:false, saveUninitialized:false}));

app.use(methodOverride('_method'));
// app.use(passport.initialize());
// app.use(passport.session());

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

// isAutheniticate
app.get('/add',isAuthenticated, (req,res)=>{    
  res.render('newproduct')
});

app.post('/products',async(req,res)=>{
  try{
  const { name, price, img }= req.body;
  const data= await Items.create({
    name,
    price,
    img,
    timestamp: new Date().toISOString()
  });
  console.log(data)
  res.redirect('/products');
}catch(error){
  console.log(error);
}
});

app.get('/products/:id',async(req,res)=>{
  const itemId= req.params.id;
  const data=await Items.findByPk(itemId);
  res.render('info',{ data });
});

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


app.delete('/products/:id',async(req,res)=>{
  const itemId=req.params.id;
  await Items.destroy({
    where:{
      id:itemId
    }
  })
  res.redirect('/products');
});

app.get('/signin',async(req,res)=>{
  res.render('signin');
})

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


app.get('/login',(req,res)=>{
  res.render('login');
})

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


// db.sequelize.sync().then((req)=>{
  app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
  });
// });

