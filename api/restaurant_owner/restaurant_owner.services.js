/*
 ** Load Node Modules **
 */
const express = require("express");
const app = express();

app.use(require("sanitize").middleware);
const responseHandler = require("../../utility/responseHandler");

const validation = require("../../lib/validation");

const tableJson = require("../../config/table.json");
const User = require("../models/User");
const userValidate = require("../validation/userValidate")

const md5 = require('md5');
const config = require("../../config/environment");
const mailService = require('../../lib/mail.service')


exports.createRestaurantOwner = (data) => {
  return new Promise(function (resolve, reject) {
    
    const otp = Math.floor(1000 + Math.random() * 9000);
    const emailHash = md5(data.email + otp);

    if (validation.isEmpty(data.firstName)) {
      reject({ message: 'Please enter your first name', code: 400 });
    }
    else if (validation.isEmpty(data.lastName)) {
      reject({ message: 'Please enter your last name', code: 400 });
    }
    else if (validation.isEmpty(data.phoneNumber)) {
      reject({ message: 'Please enter your mobile number', code: 400 });
    }
    else if (validation.isEmpty(data.businessName)) {
      reject({ message: 'Please enter your business name', code: 400 });
    }
    else if (validation.isEmpty(data.businessDetail)) {
      reject({ message: 'Business detail required', code: 400 });
    }
    else if (validation.isEmpty(data.email)) {
      reject({ message: 'Enter your email address.', code: 400 });
    }
    else if (validation.validateEmail(data.email) === false) {
      reject({ message: 'Enter a valid email address.', code: 400 });
    }
    else if (validation.isEmpty(data.password)) {
      reject({ message: 'Please choose a password.', code: 400 });
    }
    let dataObject = {
      firstName : data.firstName,
      lastName : data.lastName,
      businessName : data.businessName,
      businessDetail : data.businessDetail,
      phoneNumber : data.phoneNumber,
      email : data.email,
      password : data.password,
      userType: "restaurant_owner",
      emailHash,
      subType: data.subType,
    };
    if(!data.profilePicture){
      dataObject.profilePicture = 'avatar restaurant-Icon.png'
    }
    console.log(dataObject)
      User
        .create(dataObject)
        .then((resp) => {
          let link = config.clientUrl + 'email/verification/' + emailHash + '/' + resp._id;
          const emailResp = mailService.emailVerification(resp.email, resp.firstName, link);
          resolve(resp)
        })
        .catch((error) => {
          if (error.name === "ValidationError") {
            reject({ message: error.message, code: 400 });
          } else {
            reject({ message: `Internal Server Error ${error}`, code: 500 });
          }
        });
  });
};
