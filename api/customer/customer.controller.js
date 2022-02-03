/*
 ** Load Modules **
 */
const express = require("express");
const app = express();
const sanitizer = require("sanitize")();
const jwt = require("jsonwebtoken");
const config = require('../../config/environment');

app.use(require("sanitize").middleware);

const validation = require("../../lib/validation");
/** Services   */
const CommonService = require("../common/common.services");
const CustomerService = require("../customer/customer.services")
const tableJson = require("../../config/table.json");

/* ## Include libraries  */
const responseHandler = require("../../utility/responseHandler");
const striptags = require("striptags");

/*
 ** Function Name : getSingleCustomer
 ** Method  : GET
 ** Description : this method returns single Customer.
 ** Params : .
 */

exports.getSingleCustomer = (req, res, next) => {
  CommonService.getSingle("User", "customer", req.params.id)
  .then((results) => {
    return responseHandler.resHandler(true, results, {}, res, 200);
  })
  .catch((error) => {
    return responseHandler.resHandler(false, {}, error.message, res, error.code);
  });
}

/*
 ** Function Name : createCustomer
 ** Method  : PUT
 ** Description : this method will create Customer.
 ** Params : .
 */

exports.createCustomer = (req, res, next) => {
  CustomerService.createCustomer(req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      // let errorMsg = (error.message.includes('E11000'))? 'Email already exist' : error.message;
      // return responseHandler.resHandler(false, {}, errorMsg, res, error.code);
      if(error.message.includes('E11000')){
        error.message = "Email already exist"
        error.code = 400
      }
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : loginCustomer
 ** Method  : POST
 ** Description : this method will login customer.
 ** Params : .
 */

exports.loginCustomer = (req, res, next) => {
  CommonService.login("User", "customer" ,"customer", req)
    .then((results) => {

      return responseHandler.resHandler(true, results, "You are successfully logged in.", res, 200);
    })
    .catch((error) => {
      console.log('error',error);
      return responseHandler.resHandler(false, {}, error.message, res, 400);
    });
};


/*
 ** Function Name : socialLoginCustomer
 ** Method  : POST
 ** Description : this method will login customer.
 ** Params : .
 */

exports.socialLoginCustomer = (req, res, next) => {
  console.log('req.body',req.body);
  CommonService.socialLogin(req, 'customer')
  .then((results) => {

    return responseHandler.resHandler(true, results, {} , res, 200);
  })
  .catch((error) => {
    console.log('error',error);
    return responseHandler.resHandler(false, {}, error.message, res, error.code);
  });
};

/*
 ** Function Name : editCustomer
 ** Method  : PUT
 ** Description : this method will edit Customer's data.
 ** Params : .
 */

exports.editCustomer = (req, res, next) => {
  CommonService.edit("User", "customer",req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      if(error.message.includes('E11000')){
        error.message = "Email already exist"
        error.code = 400
      }
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : deleteCustomer
 ** Method  : PUT
 ** Description : this method will delete Customer's data.
 ** Params : .
 */

exports.deleteCustomer = (req, res, next) => {
  CommonService.delete("User", "customer", req.params.id)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : statusChangeCustomer
 ** Method  : PUT
 ** Description : this method will change the status of Customer's data.
 ** Params : .
 */

exports.statusChangeCustomer = (req, res, next) => {
  CommonService.statusChange("User", "customer" , req.params.id, req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : getCustomerAllOrders
 ** Method  : GET
 ** Description : this method is used to get All orders of customer
 ** Params : .
 */

exports.getCustomerAllOrders = (req, res) => {
  CustomerService.getCustomerAllOrders(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
}

/*
 ** Function Name : imageUploadCustomer
 ** Method  : POST
 ** Description : this method will upload image of customer.
 ** Params : .
 */

exports.imageUploadCustomer = (req, res, next) => {
  CommonService.imageUpload("User", req, "customer", "profilePicture")
    .then((results) => {
      return responseHandler.resHandler(true, results, {} , res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};


/*
 ** Function Name : customerValidate
 ** Method  : GET
 ** Description : this method returns single Customer.
 ** Params : .
 */

exports.customerValidate = (req, res, next) => {
  console.log('abbccbbcb')
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  console.log('token',token);
  //if no token found, return response (without going to the next middelware)
  if (!token) {
    console.log("me 1");
    return    responseHandler.resHandler(true, "No token provided", "No token provided" , res, 400);
  }
  try
  {
      //if can verify the token, set req.user and pass to next middleware
      const decoded = jwt.verify(token, config.secrets.key);
      req.user = decoded;

      // Verify user exists in database
      console.log('decoded',decoded);
      CustomerService.customerFindById(decoded,decoded.userType).then(results => {
        return responseHandler.resHandler(true, results, {} , res, 200);
      })
          .catch(error => {
              //res.status(400).json({"error" :"Invalid token."});
              console.log("me 2");
              return responseHandler.resHandler(false, "2", error , res, 400);

          });

  } catch (ex) {
    //if invalid token
    console.log("me 3",ex);
    return responseHandler.resHandler(false, "2", ex , res, 400);
  }

    
}

/*
 ** Function Name : editAddr
 ** Method  : PUT
 ** Description : this method will create Customer.
 ** Params : .
 */

exports.editAddr = (req, res, next) => {
  CustomerService.editAddr(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};


/*
 ** Function Name : editDetals
 ** Method  : PUT
 ** Description : this method will create Customer.
 ** Params : .
 */

exports.editDetails = (req, res, next) => {
  CustomerService.editDetails(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};