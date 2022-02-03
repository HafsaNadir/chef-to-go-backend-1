/*
 ** Load Modules **
 */
const express = require("express");
const app = express();
const sanitizer = require("sanitize")();

app.use(require("sanitize").middleware);

/** Services   */
const CommonService = require("../common/common.services");
const RestaurantService = require("../restaurant/restaurant.services");
const tableJson = require("../../config/table.json");

/* ## Include libraries  */
const responseHandler = require("../../utility/responseHandler");
const striptags = require("striptags");

/*
 ** Function Name : getSingleRestaurant
 ** Method  : GET
 ** Description : this method returns single Restaurant.
 ** Params : .
 */

exports.getSingleRestaurant = (req, res, next) => {
    CommonService.getSingle("Restaurant", "", req.params.id)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
}


/*
 ** Function Name : getSingleRestaurant
 ** Method  : GET
 ** Description : this method returns single Restaurant.
 ** Params : .
 */

exports.getMyRestaurant = (req, res, next) => {

  console.log('res.user',req.user);

  RestaurantService.getMyRestaurant(req.user.id)
  .then((results) => {
    return responseHandler.resHandler(true, results, {}, res, 200);
  })
  .catch((error) => {
    return responseHandler.resHandler(false, {}, error.message, res, error.code);
  });
}


/*
 ** Function Name : getSingleRestaurant
 ** Method  : GET
 ** Description : this method returns single Restaurant.
 ** Params : .
 */

exports.getAllRestaurant = (req, res, next) => {


  RestaurantService.getAllRestaurant(req)
  .then((results) => {
    return responseHandler.resHandler(true, results, {}, res, 200);
  })
  .catch((error) => {
    return responseHandler.resHandler(false, {}, error.message, res, 500);
  });
}


/*
 ** Function Name : createRestaurant
 ** Method  : PUT
 ** Description : this method will create Restaurant.
 ** Params : .
 */

exports.createRestaurant = (req, res, next) => {
  RestaurantService.createRestaurant(req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      if(error.message.includes('name')){
        error.message = "Restaurant Name already exist"
        error.code = 400
      }
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : editRestaurant
 ** Method  : PUT
 ** Description : this method will edit Restaurant's data.
 ** Params : .
 */

exports.editRestaurant = (req, res, next) => {
  RestaurantService.editRestaurant(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : editPreferences
 ** Method  : PUT
 ** Description : this method will edit Preferences's data.
 ** Params : .
 */

exports.editPreferences = (req, res, next) => {
  RestaurantService.editPreferences(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : editTimings
 ** Method  : PUT
 ** Description : this method will edit Timing's data.
 ** Params : .
 */

exports.editTimings = (req, res, next) => {
  RestaurantService.editTimings(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};


/*
 ** Function Name : editPreferences
 ** Method  : PUT
 ** Description : this method will edit Preferences's data.
 ** Params : .
 */

exports.editLocation = (req, res, next) => {
  RestaurantService.editLocation(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};


/*
 ** Function Name : deleteRestaurant
 ** Method  : PUT
 ** Description : this method will delete Restaurant's data.
 ** Params : .
 */

exports.deleteRestaurant = (req, res, next) => {
  CommonService.delete("Restaurant", "", req.params.id)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : statusChangeRestaurant
 ** Method  : PUT
 ** Description : this method will change the status of Restaurant's data.
 ** Params : .
 */

exports.statusChangeRestaurant = (req, res, next) => {
  CommonService.statusChange("Restaurant", "", req.params.id, req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : deliveryStatusChangeRestaurant
 ** Method  : PUT
 ** Description : this method will change the status of Restaurant's data.
 ** Params : .
 */

exports.deliveryStatusChangeRestaurant = (req, res, next) => {
  RestaurantService.deliveryStatusChangeRestaurant(req.params.id, req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : imageUploadRestaurant
 ** Method  : POST
 ** Description : this method will upload image of restaurant.
 ** Params : .
 */

exports.imageUploadRestaurant = (req, res, next) => {
  RestaurantService.imageUploadRestaurant(req,res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {} , res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, 500);
    });

};
/*
 ** Function Name : coverImageUploadRestaurant
 ** Method  : POST
 ** Description : this method will upload cover image of restaurant.
 ** Params : .
 */

exports.coverImageUploadRestaurant = (req, res, next) => {
  RestaurantService.coverImageUploadRestaurant(req,res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {} , res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, 500);
    });
};


/*
 ** Function Name : getRestaurantAllOrders
 ** Method  : GET
 ** Description : this method is used to get All orders of Restaurant
 ** Params : .
 */

exports.getRestaurantAllOrders = (req, res) => {
  RestaurantService.getRestaurantAllOrders(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
}

/*
 ** Function Name : getRestaurantBySlug
 ** Method  : GET
 ** Description : this method returns single Restaurant by slug.
 ** Params : .
 */

exports.getRestaurantBySlug = (req, res, next) => {

  console.log('res.user',req.user);

  RestaurantService.getRestaurantBySlug(req.params.slug)
  .then((results) => {
    return responseHandler.resHandler(true, results, {}, res, 200);
  })
  .catch((error) => {
    return responseHandler.resHandler(false, {}, error.message, res, 500);
  });
}