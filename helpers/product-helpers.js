// const ThenPromise = require('promise')

const { reject, resolve } = require('promise')

var db=require('../config/connection')
var collection=require('../config/collections')
const async = require('hbs/lib/async')
const { ObjectId } = require('mongodb')
const { response } = require('express')
var objectId=require('mongodb').ObjectId
module.exports={
    addProduct:(product,callback)=>{
        console.log(product)
     
            db.get().collection('product').insertOne(product).then((data)=>{          
        callback(data)
        })
    },
    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products=await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray() 
            resolve(products)          
        })
    },
    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).remove({_id:objectId(prodId)}).then((response)=>{
                console.log("remove ."+response);
                resolve(response)
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            console.log(proDetails)
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(proId)},{                
                $set:{
                    Name:proDetails.Name,
                    Email:proDetails.Email,
                    Password:proDetails.Password                   
                }
            }).then((response)=>{ 
                console.log("resol : "+resolve)
                resolve()
            })
        })
    }
}  