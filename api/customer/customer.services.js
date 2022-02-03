/*
 ** Load Node Modules **
 */
const express = require("express");
const app = express();

app.use(require("sanitize").middleware);
const responseHandler = require("../../utility/responseHandler");

const validation = require("../../lib/validation");
const md5 = require('md5');
const tableJson = require("../../config/table.json");
const User = require("../models/User");
const userValidate = require("../validation/userValidate");
const config = require("../../config/environment");
const { reject } = require("lodash");
const mailService = require('../../lib/mail.service')

exports.customerFindById = (data, type) => {
  return new Promise(function (resolve, reject) {
    let obj = { _id: data.id, userType: type };
    User.findOne(obj)
      .then(employee => {
        if (!employee) {
          reject('invalid token');
        }
        else {
          resolve(employee);
        }
      })
      .catch(error => {
        console.log('error', error);
        reject(error.stack)
      });
  })

}
exports.createCustomer = (data) => {
  return new Promise(function (resolve, reject) {
    let model = new userValidate(data);
    let modelResp = model.validateSchema();
    console.log("res", modelResp.value);
    if (modelResp.error) {
      reject({ message: modelResp.error.details[0].message, code: 400 });
    } else {
      // const customer = new User({ ...modelResp, userType: 'Customer' });
      //  console.log('customer',customer);
      modelResp.value.userType = "customer";
      const otp = Math.floor(1000 + Math.random() * 9000);
      const emailHash = md5(modelResp.value.email + otp);
      modelResp.value.emailHash = emailHash
      User.create(modelResp.value)
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
    }
  });
};

exports.getCustomerAllOrders = (req) => {
  return new Promise(function (resolve, reject) {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    User.findById({ _id: req.params.id })
      .then((result) => {
        if (!result) {
          reject({ message: "Something Went Wrong", code: 400 });
        }
        result
          .populate({
            path: "orders",
            options: {
              limit: pageOptions.limit,
              skip: (pageOptions.page - 1) * pageOptions.limit,
            },
          })
          .execPopulate()
          .then((data) => {
            if (!data) {
              reject({ message: "No Orders Found", code: 200 });
            }
            resolve(data.orders);
          })
          .catch((err) =>
            reject({ message: `Internal Server Error ${err}`, code: 500 })
          );
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );
  });
};

exports.editAddr = (req) => {
  return new Promise(function (resolve, reject) {
  const obj = {
    address: req.body
  }
  console.log(obj)
  console.log(req.user.id)
  User.findOneAndUpdate({ _id: req.user.id }, obj, { new: true })
    .then((resp) => {
      if (!resp) {
        reject({ message: "No data found", code: 400 });
      }
      resolve(resp);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        reject({ message: error.message, code: 400 });
      } else {
        reject({ message: `Internal Server Error ${error}`, code: 500 });
      }
    }
    );
  })
}

exports.editDetails = (req) => {
  return new Promise(function (resolve, reject) {
  const obj = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber
  }
  User.findOneAndUpdate({ _id: req.user.id }, obj, { new: true })
    .then((resp) => {
      if (!resp) {
        reject({ message: "No data found", code: 400 });
      }
      resolve(resp);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        reject({ message: error.message, code: 400 });
      } else {
        reject({ message: `Internal Server Error ${error}`, code: 500 });
      }
    }
    );
  })
}