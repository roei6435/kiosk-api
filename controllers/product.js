const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();
const isAuth = require('./isAuth');

const User = require('../models/user');
const Store = require('../models/store');
const Category = require('../models/category');
const Product= require('../models/product');


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
router.put('/updateCategory',isAuth, async(request,response)=>{

    const store = await Store.findOne({associateId:request.account._id});
    const {
        categoryName,
        categoryImage,
        priority
    }= request.body;

    const category= await Category.findOne({})


})


router.delete('/deleteCategory',isAuth, async(request,response)=>{})
router.get('/getAllCategory',isAuth, async(request,response)=>{

    
    try {
        const categories = await Category.find();
        return response.status(200).json({
            allCategories: categories
        })
    }
    catch (error) {
        return response.status(500).json({
            message: error
        });
    }
})

router.post('/addProduct',isAuth, async(request,response)=>{})
router.put('/updateProduct',isAuth, async(request,response)=>{})
router.delete('/deleteProduct',isAuth, async(request,response)=>{})
router.get('/getAllProducts',isAuth, async(request,response)=>{
        
    try {
        const products = await Product.find();
        return response.status(200).json({
            allProducts: products
        })
    }
    catch (error) {
        return response.status(500).json({
            message: error
        });
    }

})

module.exports = router;