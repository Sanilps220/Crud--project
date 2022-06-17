var express = require('express');
const async = require('hbs/lib/async');
const { render } = require('../app');
var router = express.Router();

const productHelpers = require('../helpers/product-helpers');
var productHelper = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');

const verifyLogin=(req,res,next)=>{   
    if(req.session.admin){
    next()
    }else{
    res.redirect('admin/login')
    }
  }
/* GET admin listing. */
router.get('/',verifyLogin,function (req, res, next) {
    let admin=req.session.admin
    console.log(admin);
    
    productHelpers.getAllProducts().then((products) => {
        console.log("asdfdsasd")   
       res.render('admin/view-products',{products,admin})
    })
});

const credential = {
    Email:"admin",
    Password:"123"
}

router.get('/login',(req,res)=>{
    let admin=req.session.admin
    if(req.session.adminLog){
       console.log('gt log') 
     res.redirect('/admin')
    }else{  
     res.render('admin/login',{"loginErr":req.session.adminErr})
     req.session.loginErr=false
    }
 })

router.post('/login',(req,res)=>{
    console.log("adm - logn") 
    if(req.body.Email == credential.Email && req.body.Password == credential.Password) {
        console.log(req.body.Email)
        req.session.adminLog = true
        req.session.admin = req.body.Email
        res.redirect('/admin')
    }else{
        req.session.adminErr = "Invalid username or password"  
        console.log('admin in else')
        res.redirect('/admin/login')      
    }
})

router.get('/admin-logout',(req,res)=>{
    req.session.admin=null
    req.session.adminLog=false
    console.log('klklklk');
    res.redirect('/admin/login')
})

router.get('/add-details', function (req, res) {
    res.render('admin/add-products')
})

router.post('/add-products', (req, res) => {
    productHelpers.addProduct(req.body, (result) => {
        res.render("admin/add-products")
    })
})

router.get('/delete-product/:id', (req, res) => {
    let proId = req.params.id
    console.log(proId)
    productHelpers.deleteProduct(proId).then((response) => {
        res.redirect('/admin/')
       
    })
})

router.get('/edit-product/:id', async (req, res) => {
    let product = await productHelpers.getProductDetails(req.params.id)
    res.render('admin/edit-product', { product })
})
router.post('/edit-product/:id', (req, res) => {
    console.log(req.body.Email)

    productHelpers.updateProduct(req.params.id,req.body).then(() => {
        res.redirect('/admin')
    })
})
router.get('/stories',(req,res)=> {
    let admin=req.session.admin
    userHelpers.getAllUser().then((products) => {
    console.log("fffffffh")   
    res.render('admin/stories',{products,admin})
    })  
})

router.get('/delete-user/:id', (req, res) => {
    let proId = req.params.id
    console.log(proId)
    console.log('byby');
    userHelpers.deleteUser(proId).then((response) => {
        console.log('byby');
        res.redirect('/admin/stories')
       
    })
})
router.get('/add-users', function (req, res) {
    res.render('admin/add-pro')
})

router.post('/add-pro', (req, res) => {
   // userHelpers.addUser(req.body, (result) => {
        userHelpers.doSignup(req.body).then((response)=>{
        res.render("admin/add-pro")
    })
})
module.exports = router;

