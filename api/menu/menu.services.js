/*
 ** Load Node Modules **
 */
const express = require("express");
const app = express();

app.use(require("sanitize").middleware);
const responseHandler = require("../../utility/responseHandler");

const validation = require("../../lib/validation");

const tableJson = require("../../config/table.json");
const Menu = require("../models/Menu");
const Restaurant = require("../models/Restaurant");

const menuValidate = require("../validation/menuValidate");
const imagesUpload = require('../../lib/imagesUpload');


exports.getRestaurantMenu = (id) => {
  return new Promise(function (resolve, reject) {

        let obj = { restaurantId: id ,isDeleted : false , status : 'active' , isAvailable : true };
        Menu.find(obj)
        .populate('categoryId',' name')
        .then(menu => {
            resolve(menu);
        })
        .catch(error => {
          reject(error.stack);
        });
  

  })

}



exports.getVendorMenu = (id) => {
  return new Promise(function (resolve, reject) {
    Restaurant.findOne({
      restaurantOwnerId : id
    })
    .then(resp => {
      console.log('resp',resp);
      if(resp != null){
        let obj = { restaurantId: resp._id ,isDeleted : false  };
        Menu.find(obj)
        .populate('categoryId',' name')
        .then(menu => {
            console.log(menu)
            resolve(menu);
        })
        .catch(error => {
          reject(error.stack);
        });
  
      }else{
        reject("Invalid Access");

      }

    })
    .catch(error=>{

    })
  })

}

exports.addDiscountMenu = (req) => {
  return new Promise(function (resolve, reject) {
    const reqObject = {
      isDiscount: req.body.isDiscount,
      discountType: req.body.discountType,
      discountValue: req.body.discountValue
    }
    Restaurant.findOne({
      restaurantOwnerId : req.user.id
    })
    .then(resp => {
      console.log('resp',resp);
      if(resp != null){

        let queryObj = { _id: req.params.id ,restaurantId : resp._id};
        console.log('queryObj',queryObj);
        Menu.findOneAndUpdate(queryObj, reqObject, {new: true})
        .then((resp) => {
          if (!resp) {
            reject({ message: "No data found", code: 400 });
          }
          resolve(resp);
        })
        .catch((error) =>
          reject({ message: `Internal Server Error ${error}`, code: 500 })
        );
  
        /* */

      }else{
        reject({ message: "bad request", code: 400 });

      }

    })
    .catch(error =>{
      reject({ message: `Internal Server Error ${error}`, code: 500 });

    });  

  })
}

exports.createMenu = (req,res) => {
  return new Promise(function (resolve, reject) {
    imagesUpload.uploadImage(req, res, function (err) {
      if (err) {
        console.log('img err ', err);
       // return responseHandler.resHandler(false, null, 'Unknown file format.', res, 400);
       reject({ message: "bad request", code: 400 });

      }
      if (req.fileValidationError) {
        //fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
       // return responseHandler.resHandler(false, null, 'Unknown file format.', res, 400);
       reject({ message: "bad request", code: 400 });

      }
      if (typeof req.file == 'undefined') {
        // fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
        //return responseHandler.resHandler(false, null, 'Something went wrong', res, 400);
        reject({ message: "bad request", code: 400 });

      }
      if (req.file.size > 15728640) {
        fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
      //  return responseHandler.resHandler(false, null, 'The file size is too large. Please upload a photo of maximum up to 15MB.', res, 400);
      reject({ message: "bad request", code: 400 });

      }
      if (validation.isEmpty(req.body.name)) {
        reject({ message: 'Please enter restaurant name', code: 400 });
      }
      else if (validation.isEmpty(req.body.shortDesc)) {
        reject({ message: 'Please give short description', code: 400 });
      }
      else if (validation.isEmpty(req.body.price)) {
        reject({ message: 'Please enter price', code: 400 });
      }
      else if (validation.isEmpty(req.body.categoryId)) {
        reject({ message: 'Category required', code: 400 });
      }
      let reqObject = {
        image: req.file.filename,
        name: req.body.name,
        shortDesc: req.body.shortDesc,
        variation: [],
        categoryId: req.body.categoryId,
        price: req.body.price,
        restaurantId : ""
      };
      if(req.body.longDesc){
        reqObject.longDesc = req.body.longDesc
      }
      console.log(reqObject)
      Restaurant.findOne({
        restaurantOwnerId : req.user.id
      })
      .then(resp => {
        console.log('resp',resp);
        if(resp != null){
          reqObject.restaurantId = resp._id;
          console.log('reqObject',reqObject);

          Menu.create(reqObject)
          .then((resp) => resolve(resp))
          .catch((error) => {
            if (error.name === "ValidationError") {
              reject({ message: error.message, code: 400 });
            } else {
              reject({ message: `Internal Server Error ${error}`, code: 500 });
            }
          });
  
        }else{
          reject({ message: "bad request", code: 400 });

        }

      })
      .catch(error =>{
        reject({ message: `Internal Server Error ${error}`, code: 500 });

      });  

  
    });
  
  });
};



exports.editMenu = (req,res) => {
  return new Promise(function (resolve, reject) {
    let image;
    imagesUpload.uploadImage(req, res, function (err) {
      if (err) {
        console.log('req.file',req.file);
        console.log('img err ', err);
       reject({ message: "bad request", code: 400 });

      }
      if(req.file == null || req.file == undefined){
       // reject({ message: "file null", code: 400 });
        image = req.body.image;        
      }
      else{
        if (req.fileValidationError) {
          reject({ message: "bad request", code: 400 });
   
         }
         if (typeof req.file == 'undefined') {
           reject({ message: "bad request", code: 400 });
   
         }
         if (req.file.size > 15728640) {
          fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
          reject({ message: "bad request", code: 400 });
  
        }
        image = req.file.filename;        
     
      }
      if (validation.isEmpty(req.body.name)) {
        reject({ message: 'Please enter restaurant name', code: 400 });
      }
      else if (validation.isEmpty(req.body.shortDesc)) {
        reject({ message: 'Please give short description', code: 400 });
      }
      else if (validation.isEmpty(req.body.price)) {
        reject({ message: 'Please enter price', code: 400 });
      }
      else if (validation.isEmpty(req.body.categoryId)) {
        reject({ message: 'Category required', code: 400 });
      }
      
      let reqObject = {
        image: image,
        name: req.body.name,
        shortDesc: req.body.shortDesc,
        categoryId: req.body.categoryId,
        price : req.body.price,
        
      };
      if(req.body.longDesc){
        reqObject.longDesc = req.body.longDesc
      }
      console.log('reqObject',reqObject);
      Restaurant.findOne({
        restaurantOwnerId : req.user.id
      })
      .then(resp => {
        console.log('resp',resp);
        if(resp != null){

          console.log('reqObject',reqObject);
          let queryObj = { _id: req.params.id ,restaurantId : resp._id};
          console.log('queryObj',queryObj);
          Menu.findOneAndUpdate(queryObj, reqObject, {new: true})
          .then((resp) => {
            if (!resp) {
              reject({ message: "No data found", code: 400 });
            }
            resolve(resp);
          })
          .catch((error) =>
            reject({ message: `Internal Server Error ${error}`, code: 500 })
          );
    
          /* */
  
        }else{
          reject({ message: "bad request", code: 400 });

        }

      })
      .catch(error =>{
        reject({ message: `Internal Server Error ${error}`, code: 500 });

      });  

  
    });
  
  });
};


exports.addVariation = (req) => {
  return new Promise(function (resolve, reject) {
    const variation =
       {
        name : req.body.name,
        type : req.body.type,
        items : req.body.items
      };
    
    Restaurant.findOne({
      restaurantOwnerId : req.user.id
    })
    .then(resp => {
      console.log('resp',resp);
      if(resp != null){

        let queryObj = { _id: req.params.id ,restaurantId : resp._id};
        console.log('queryObj',queryObj);
      //  console.log('reqObject',reqObject);


        Menu.findOneAndUpdate(queryObj, {
          $push: {
            variation : variation,
          }
        },
        {new: true})
        .then((resp) => {
          if (!resp) {
            reject({ message: "No data found", code: 400 });
          }
          resolve(resp);
        })
        .catch((error) =>
          reject({ message: `Internal Server Error ${error}`, code: 500 })
        );
  
        /* */

      }else{
        reject({ message: "bad request", code: 400 });

      }

    })
    .catch(error =>{
      reject({ message: `Internal Server Error ${error}`, code: 500 });

    });  

  })
}


exports.statusChangeMenu = (req) => {
  return new Promise(function (resolve, reject) {
    const reqObject = {
      isAvailable: req.body.status,
    }
    Restaurant.findOne({
      restaurantOwnerId : req.user.id
    })
    .then(resp => {
      console.log('resp',resp);
      if(resp != null){

        let queryObj = { _id: req.params.id ,restaurantId : resp._id};
        console.log('queryObj',queryObj);
        Menu.findOneAndUpdate(queryObj, reqObject, {new: true})
        .then((resp) => {
          if (!resp) {
            reject({ message: "No data found", code: 400 });
          }
          resolve(resp);
        })
        .catch((error) =>
          reject({ message: `Internal Server Error ${error}`, code: 500 })
        );
  
        /* */

      }else{
        reject({ message: "bad request", code: 400 });

      }

    })
    .catch(error =>{
      reject({ message: `Internal Server Error ${error}`, code: 500 });

    });  

  })
}