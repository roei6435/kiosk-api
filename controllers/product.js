const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const isAuth = require('./isAuth');

const User = require('../models/user');
const Store = require('../models/store');
const Category = require('../models/category');
const Product= require('../models/product');

router.get('/getAllCategories',isAuth, async(request,response)=>{ 

    const accId=request.account._id;
    const store = await Store.findOne({associateId:accId});
    Category.find({storeId:store._id})    //find all categories with this storeId. 
    .then(categories => {
        return response.status(200).json({
            status: true,
            message: categories
        })
    })
    .catch(err=>{
        return response.status(500).json({
            status: true,
            message: err
        })
    })
})

router.post('/addCategory',isAuth, async(request,response)=>{

    const store = await Store.findOne({associateId:request.account._id});

    const {categoryName,categoryImage,priority }= request.body;

   const isCategoryExist = await Category.findOne({categoryName: categoryName})
   if (isCategoryExist){
       return response.status(200).json({
           message: 'Category already exists'
       })
   }
   else{
       const categoryId=mongoose.Types.ObjectId();
        const _category=new Category({
            _id:categoryId,
            storeId:store._id,
            categoryName:categoryName,
            categoryImage: categoryImage,
            priority: priority

        })
        return _category.save()
        .then(newCategory =>{
            return response.status(200).json({
                newCategory:newCategory
            })
        })
        .catch(err=>{
            return response.status(500).json({
                message:err
            })
        })

   }




})
router.put('/updateCategory/:categoryId',isAuth, async(request,response)=>{   //route with variable

    const {categoryName,categoryImage,priority }= request.body;
    const cId=request.params.categoryId;
    Category.findById(cId)
    .then(category=>{
        if(category){
            category.categoryName=categoryName;
            category.categoryImage=categoryImage;
            category.priority=priority;
            return category.save().
            then(category_updated=>{
                return response.status(200).json({
                    status: true,
                    message:category_updated
                })
            })
        }else{
            return response.status(200).json({
                status: false,
                message:'Category not found'
            })
        }
    })
    .catch(err=>{
        return response.status(500).json({
            status:false,
            message:err
        })
    })
})


router.delete('/deleteCategory/:categoryId',isAuth, async(request,response)=>{

     const cId=request.params.categoryId;
     Category.findByIdAndDelete(cId).then(category_deleted=>{
        if(category_deleted){
         return response.status(200).json({
             status: true,
            message:category_deleted
        })
        }else{
            return response.status(200).json({
                message:'Category not found'
            })  
        }
     }).catch(err=>{
         return response.status(500).json({
             message:err
         })
     })

})



router.post('/addProduct',isAuth, async(request,response)=>{})
router.put('/updateProduct',isAuth, async(request,response)=>{})
router.delete('/deleteProduct',isAuth, async(request,response)=>{})
router.get('/getAllProducts',isAuth, async(request,response)=>{})

module.exports = router;