/*
 ** Load Modules **
 */
const express = require("express");
const app = express();
const sanitizer = require("sanitize")();

app.use(require("sanitize").middleware);

/** Services   */
const CommonService = require("../common/common.services");
const MenuService = require("../menu/menu.services");
const tableJson = require("../../config/table.json");

/* ## Include libraries  */
const responseHandler = require("../../utility/responseHandler");
const striptags = require("striptags");

/*
 ** Function Name : getAllMenu
 ** Method  : GET
 ** Description : this method return all .
 ** Params : .
 */

// exports.getAllMenu = (req, res, next) => {
//   CommonService.getAll("Menu", "", req)
//     .then((results) => {
//       return responseHandler.resHandler(true, results, {}, res, 200);
//     })
//     .catch((error) => {
//       return responseHandler.resHandler(false, {}, error.message, res, error.code);
//     });
// };



/*
 ** Function Name : getVendorMenu
 ** Method  : GET
 ** Description : this method return all menu of vendor .
 ** Params : .
 */

 exports.getVendorMenu = (req, res, next) => {
   let vendorId = req.user.id;
   MenuService.getVendorMenu(vendorId)
     .then((results) => {
       return responseHandler.resHandler(true, results, {}, res, 200);
     })
     .catch((error) => {
       return responseHandler.resHandler(false, {}, error.message, res, 500);
     });
 };


/*
 ** Function Name : getVendorMenu
 ** Method  : GET
 ** Description : this method return all menu of vendor .
 ** Params : .
 */

exports.getRestaurantMenu = (req, res, next) => {
  let vendorId = req.params.id;
  MenuService.getRestaurantMenu(vendorId)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, 500);
    });
};



/*
 ** Function Name : createMenu
 ** Method  : PUT
 ** Description : this method will create Menu.
 ** Params : .
 */

exports.createMenu = (req, res, next) => {
  console.log('res.user',req.user);
  MenuService.createMenu(req,res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      console.log('error',error);
      return responseHandler.resHandler(false, {}, error.message, res, 500);
    });
};


/*
 ** Function Name : addVariation
 ** Method  : PUT
 ** Description : this method will add variation in Menu.
 ** Params : .
 */

exports.addVariation = (req, res, next) => {
  console.log('res.user',req.user);
  MenuService.addVariation(req,res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      console.log('error',error);
      return responseHandler.resHandler(false, {}, error.message, res, 500);
    });
};




/*
 ** Function Name : editMenu
 ** Method  : PUT
 ** Description : this method will edit Menu's data.
 ** Params : .
 */

exports.editMenu = (req, res, next) => {
  console.log('p',req.params.id);
  MenuService.editMenu(req,res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : addDiscountMenu
 ** Method  : PUT
 ** Description : this method will edit Menu's data.
 ** Params : .
 */

exports.addDiscountMenu = (req, res, next) => {
  MenuService.addDiscountMenu(req,res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};
/*
 ** Function Name : deleteMenu
 ** Method  : PUT
 ** Description : this method will delete Menu's data.
 ** Params : .
 */

exports.deleteMenu = (req, res, next) => {
  CommonService.delete("Menu", "", req.params.id)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : statusChangeMenu
 ** Method  : PUT
 ** Description : this method will change the status of Menu's data.
 ** Params : .
 */

exports.statusChangeMenu = (req, res, next) => {
  MenuService.statusChangeMenu(req,res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : imageUploadMenu
 ** Method  : POST
 ** Description : this method will upload image of menu.
 ** Params : .
 */

exports.imageUploadMenu = (req, res, next) => {
  CommonService.imageUpload("Menu", req, "restaurant_owner", "image")
    .then((results) => {
      return responseHandler.resHandler(true, results, {} , res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};