const express = require('express');
const fileUpload = require('express-fileupload');

const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const bodyParser = require('body-parser');
const session = require('express-session');
const {check, validateResult, validationResult } = require('express-validator');
const expressValidator = require('express-validator');






//connect to db
mongoose.connect(config.database, { useNewUrlParser: true,useUnifiedTopology: true });
let db = mongoose.connection;
db.once('open', function(){
    console.log('Connected to MongoDB');


}).on;('error', function(error){
    console.log('Connection error: ',error);
});


let app = express();

//view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');


//public folder
app.use(express.static(path.join(__dirname, 'public')));

// Set global errors variable
app.locals.errors = null;

// get Page model
var Page = require('./models/page');

// get all pages to be rendered in header.ejs
Page.find({}).sort({sorting: 1}).exec(function(err, pages){
    if(err){
        console.log(err);
    }else{
        app.locals.pages = pages;
    }
});

// get Categories  model
var Category = require('./models/category');

// get all categories to be rendered in header.ejs
Category.find(function(err, categories){
    if(err){
        console.log(err);
    }else{
        app.locals.categories = categories;
    }
});


//express fileupload middleware
app.use(fileUpload());


//middleware for body Parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); // parse to application/json

//middleware for express session
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
    // cookie: { secure: true}
}));

//Middleware for express validator

    const errorFormatter = ({param, msg, value})=>{
        var namespace = param.split('.')
        , root = namespace.shift()
        , formParam = root;


        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg : msg,
            value: value
        }
    


      .custom((isImage, {req,body}) =>   

      isImage ({value, filename}))
            {
            var extension = (path.extname(filename)).toLowerCase();
            // console.log(extension);
            switch(extension) {
            case '.jpg':
                return '.jpg';
            case '.jpeg':
                return '.jpeg';
            case '.png':
                return '.png';
            case '':
                return '.jpg';
            default:
                return false;
            }
}

        }



// Middleware for users
app.use(express.json());
app.post('/user', (req,res)=>{
    User.create({
        Username:req.body.username,
        password:req.body.password
    }).then(user => res.json(user));

});



app.post('/user',[ check('username').isEmail(),check('password').isLength({min:8})], (req, res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array()});
    }
    User.create({
        username: req.body.username,
        password: req.body.password
    }).then(user => res.json(user));





});




//middleware for express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*', function(req,res,next){
    res.locals.cart - req.session.cart;
    next();
});


//set routes
var pages = require('./routes/pages');
var products = require('./routes/products.js');
var cart = require('./routes/cart.js');
var adminPages = require('./routes/admin_pages');
var adminCategories = require('./routes/admin_categories');
var adminProducts = require('./routes/admin_products');

app.use('/admin/pages',adminPages);
app.use('/admin/categories',adminCategories);
app.use('/admin/products',adminProducts);
app.use('/products',products);
app.use('/cart',cart);
app.use('/',pages);


//server
let port = 2200;
app.listen(port, function(){
    console.log('Server started on port ' + port);
});
