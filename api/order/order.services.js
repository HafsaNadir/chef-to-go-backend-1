/*
 ** Load Node Modules **
 */
const express = require("express");
const app = express();

app.use(require("sanitize").middleware);
const responseHandler = require("../../utility/responseHandler");

const validation = require("../../lib/validation");

const tableJson = require("../../config/table.json");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");
const orderValidate = require("../validation/orderValidate");
const Notification = require("../models/Notification")

exports.createOrder = (req) => {
  return new Promise(function (resolve, reject) {

    Order.findOne({}, {}, { sort: { createdDate: -1 } })
    .then(resp => {
      if (resp == null) {
        req.orderId = 100000;
        console.log('me here  00');
      } else {
        console.log('me here  11');
        console.log('me here  11',resp.orderId);

        req.orderId = ++resp.orderId;
        console.log('me here  11',req.orderId);

      }

      Order.create(req)
      //Order.create(modelResp.value)
        .then((resp) => resolve(resp))
        .catch((error) => {
          if (error.name === "ValidationError") {
            reject({ message: error.message, code: 400 });
          } else {
            reject({ message: `Internal Server Error ${error}`, code: 500 });
          }
        });
  
    })
    .catch(error =>{
      reject({ message: `Internal Server Error ${error}`, code: 500 });

    })



  });
};



exports.getCustomerOrder = (req) => {
  return new Promise(function (resolve, reject) {
    Order.find({"customerId" : req.user.id})
    .populate("restaurantId")
    .populate("orderDetails.id")
    .sort({orderId:-1})
    .then((resp) => resolve(resp))
      .catch((error) => {
        if (error.name === "ValidationError") {
          reject({ message: error.message, code: 400 });
        } else {
          reject({ message: `Internal Server Error ${error}`, code: 500 });
        }
      });

  });
};

exports.getVendorOrder = (req) => {
  return new Promise(function (resolve, reject) {
    console.log(11111111111111111111)
    Restaurant.findOne({
      restaurantOwnerId : req.user.id
    })
    .then(resp => {
      console.log('alii',resp);
      if(resp != null){

        Order.find({ restaurantId : resp._id})
        .populate('customerId','firstName lastName profilePicture')
        .sort({"orderId":-1})
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

  })
}


exports.getNotifications = (req) => {
  return new Promise(function (resolve, reject) {

        Notification.find({"customerId": req.user.id})
        .populate('restaurantId')
        .populate('orderId', 'orderId')
        .then((resp) => resolve(resp))
          
    .catch(error =>{
      reject({ message: `Internal Server Error ${error}`, code: 500 });

    });  

  })
}
