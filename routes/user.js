const { response } = require('express');
var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient

const productHelpers = require('../helpers/product-helpers');
const userHelpers= require('../helpers/user-helpers')

const verifyLogin=(req,res,next)=>{
  if(req.session.user.loggedIn){
  next()
  }else{
  res.redirect('/login')
  }   
}

/* GET home page. */
router.get('/', function(req, res, next) {
  let user=req.session.user
  console.log("log usr"); 
  productHelpers.getAllProducts().then((products)=>{
  res.render('user/view-products',{products,user});
  }) 
});

router.get('/login',(req,res)=>{
  if(req.session.user){
    console.log(req.session.user); 
    res.redirect('/')
  }else{  
  res.render('user/login',{"loginErr":req.session.userLoginErr})
  req.session.userLoginErr=false
  }
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  console.log(req.body);
  userHelpers.doSignup(req.body).then((response)=>{
    console.log(response)
  // req.session.loggedIn=true
  // req.session.user=response
  res.redirect('/')
  })
})
router.post('/login',(req,res)=>{   
  // console.log(req.body)
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
    
      res.redirect('/') 
    }else{
      req.session.userLoginErr="Invalid Id or Password"
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
  console.log('sess destroy')
})

module.exports = router;












// router.get('/cart',verifyLogin,async(req,res)=>{
//   let products=await userHelpers.getCartProducts(req.session.user._id)
//   res.render('user/Edit')
// })

// router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
//   userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
//     res.redirect('/')
//   })
// })




// router.post("/submit",function(req,res,next){
//   console.log(req.body)

//   MongoClient.connect('mongodb://localhost:27017',function(err,client){
//     if(err)
//       console.log('error')
//     else
//       client.db('corossroads').collection('user').insertOne(req.body)
    
//   })

//   res.send('got it')   
// })



