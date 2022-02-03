/*
 ** Load Modules **
 */
const express = require("express");
const app = express();
const sanitizer = require("sanitize")();

app.use(require("sanitize").middleware);

/** Services   */
const CommonService = require("../common/common.services");
const RestaurantOwnerService = require("../restaurant_owner/restaurant_owner.services")
const RestaurantService = require('../restaurant/restaurant.services')
const tableJson = require("../../config/table.json");

/* ## Include libraries  */
const responseHandler = require("../../utility/responseHandler");
const striptags = require("striptags");


/*
 ** Function Name : getSingleRestaurantOwner
 ** Method  : GET
 ** Description : this method returns single RestaurantOwner.
 ** Params : .
 */

exports.getSingleRestaurantOwner = (req, res, next) => {
  CommonService.getSingle("User", "restaurant_owner",req.params.id)
  .then((results) => {
    return responseHandler.resHandler(true, results, {}, res, 200);
  })
  .catch((error) => {
    return responseHandler.resHandler(false, {}, error.message, res, error.code);
  });
}

/*
 ** Function Name : createRestaurantOwner
 ** Method  : PUT
 ** Description : this method will create RestaurantOwner.
 ** Params : .
 */

exports.createRestaurantOwner = async(req, res, next) => {
  try {
    const results = await RestaurantOwnerService.createRestaurantOwner(req.body)
    const obj = {
        restaurantOwnerId: results._id,
        name: results.businessName,
        details: results.businessDetail,
        phoneNumber: results.phoneNumber,
        email: results.email,
        slug : results.businessName.replace(/ /g,"-").toLowerCase()
    }
    const restaurant = await RestaurantService.createRestaurant(obj)
    const data = {
      restaurant, 
      results
    }
    return responseHandler.resHandler(true, data, {}, res, 200);
  }
  catch(error){
    if(error.message.includes('email')){
      error.message = "Email already exist"
      error.code = 400
    }
    else if(error.message.includes('name') || error.message.includes('businessName')){
         error.message = "Business/Restaurant Name already exist"
           error.code = 400
    }
    return responseHandler.resHandler(false, {}, error.message, res, 500);
  }

  // RestaurantOwnerService.createRestaurantOwner(req.body)
  //   .then((results) => {
  //     const obj = {
  //         restaurantOwnerId: results._id,
  //         details: results.businessDetail,
  //         phoneNumber: results.phoneNumber,
  //         email: results.email,
  //         addresses: results.addresses  
  //     }
  //     RestaurantService.createRestaurant(obj)
  //     .then((resp) => {
  //       const data = {
  //         results,
  //         restaurantData: resp
  //       }
  //       return responseHandler.resHandler(true, data, {}, res, 200);
  //     })
  //     .catch((error) => {
  //       if(error.message.includes('E11000')){
  //         error.message = "Email already exist"
  //         error.code = 400
  //       }
  //       return responseHandler.resHandler(false, {}, error.message, res, error.code);
  //     })
  //   })
  //   .catch((error) => {
  //     if(error.message.includes('E11000')){
  //       error.message = "Email already exist"
  //       error.code = 400
  //     }
  //     return responseHandler.resHandler(false, {}, error.message, res, error.code);
  //   });
};
/*
 ** Function Name : loginRestaurantOwner
 ** Method  : POST
 ** Description : this method will login RestaurantOwner.
 ** Params : .
 */

exports.loginRestaurantOwner = (req, res, next) => {
  CommonService.login("User", "restaurant_owner", "restaurant_owner", req)
    .then((results) => {
      return responseHandler.resHandler(true, results, "You are successfully logged in.", res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};


/*
 ** Function Name : socialLoginVendor
 ** Method  : POST
 ** Description : this method will login vendor.
 ** Params : .
 */

exports.socialLoginVendor = (req, res, next) => {
  console.log('req.body',req.body);
  CommonService.socialLogin(req, 'restaurant_owner')
  .then((results) => {

    return responseHandler.resHandler(true, results, "You are successfully logged in.", res, 200);
  })
  .catch((error) => {
    console.log('error',error);
    return responseHandler.resHandler(false, {}, error.message, res, 400);
  });
};

/*
 ** Function Name : editRestaurantOwner
 ** Method  : PUT
 ** Description : this method will edit RestaurantOwner's data.
 ** Params : .
 */

exports.editRestaurantOwner = (req, res, next) => {
  CommonService.edit("User", "restaurant_owner", req)
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
 ** Function Name : deleteRestaurantOwner
 ** Method  : PUT
 ** Description : this method will delete RestaurantOwner's data.
 ** Params : .
 */

exports.deleteRestaurantOwner = (req, res, next) => {
  CommonService.delete("User","restaurant_owner", req.params.id)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : statusChangeRestaurantOwner
 ** Method  : PUT
 ** Description : this method will change the status of RestaurantOwner's data.
 ** Params : .
 */

exports.statusChangeRestaurantOwner = (req, res, next) => {
  CommonService.statusChange("User", "restaurant_owner", req.params.id, req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : imageUploadRestaurantOwner
 ** Method  : POST
 ** Description : this method will upload image of RestaurantOwner.
 ** Params : .
 */

exports.imageUploadRestaurantOwner = (req, res, next) => {
  CommonService.imageUpload("User", req, "restaurant_owner", "profilePicture")
    .then((results) => {
      return responseHandler.resHandler(true, results, {} , res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};