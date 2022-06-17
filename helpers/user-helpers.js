var db=require('../config/connection')
var collection=require('../config/collections')
const async = require('hbs/lib/async')
const bcrypt=require('bcrypt')
const { status } = require('express/lib/response')
const collections = require('../config/collections')
const { resolve, reject } = require('promise')
const { ObjectId } = require('mongodb')
const { response } = require('../app')

var objectId=require('mongodb').ObjectId
module.exports={
      doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collections.USER_COLLECTION).insertOne(userData).then((data)=>{      
             resolve(data)  
            })
            
        })      
    },
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
              console.log(userData.Email)
            if(user){
              
               bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        console.log("login success")
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        
                        console.log("login~failed")
                        resolve({status:false})
                    }
                })
            }else{
                console.log("login fail")
                resolve({status:false})
            }
        })
    },
    addToCart:(proId,userId)=>{
        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},
                {
                    
                        $push:{products:objectId(proId)}
                    
                }
                ).then((response)=>{
                    resolve()
                })
            }else{
                let cartObt={
                    user:objectId(userId),
                    products:[objectId(proId)]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObt).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $lookup:{
                        form:'products',
                        let:{proList:'$products'},
                        pipeline:[
                            {
                                $match:{
                                    $expr:{
                                        $in:['$_id',"$$prodList"]
                                    }
                                }
                            }
                        ],
                        as:'cartItems'
                    }
                }
            ]).toArray()
            resolve(cartItems)
        })
    }
,
getAllUser:()=>{
    return new Promise(async(resolve,reject)=>{
        let products=await db.get().collection(collection.USER_COLLECTION).find().toArray() 
        resolve(products)          
    })
},

deleteUser:(prodId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).remove({_id:objectId(prodId)}).then((response)=>{
            console.log("remove ."+response);
            resolve(response)
        })
    })
},

}
