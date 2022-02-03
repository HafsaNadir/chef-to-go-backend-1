/*
 ** Load Modules **
 */
const express = require("express");
const app = express();
const sanitizer = require("sanitize")();

app.use(require("sanitize").middleware);

/** Services   */
const CommonService = require("../common/common.services");
const AdminService = require("./admin.services")
const tableJson = require("../../config/table.json");

/* ## Include libraries  */
const responseHandler = require("../../utility/responseHandler");
const striptags = require("striptags");
const jwt = require("jsonwebtoken");

const config = require('../../config/environment');


/*
 ** Function Name : adminValidate
 ** Method  : GET
 ** Description : this method returns single Customer.
 ** Params : .
 */

exports.adminValidate = (req, res, next) => {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  //if no token found, return response (without going to the next middelware)
  if (!token) {
    return responseHandler.resHandler(true, "No token provided", "No token provided", res, 400);
  }
  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, config.secrets.key);
    req.user = decoded;

    // Verify user exists in database
    console.log('decoded', decoded);
    AdminService.adminFindById(decoded).then(results => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
      .catch(error => {
        //res.status(400).json({"error" :"Invalid token."});
        return responseHandler.resHandler(false, "2", error, res, 400);

      });

  } catch (ex) {
    //if invalid token
    return responseHandler.resHandler(false, "2", ex, res, 400);
  }


}

/*
 ** Function Name : getAllSubadmin
 ** Method  : GET
 ** Description : this method return all .
 ** Params : .
 */

exports.getAllSubadmin = (req, res, next) => {
  AdminService.getAll("Admin", "subadmin", req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};


/*
 ** Function Name : getAllCustomer
 ** Method  : GET
 ** Description : this method return all .
 ** Params : .
 */

exports.getAllCustomer = (req, res, next) => {
  AdminService.getAll("User", "customer", req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : getAllRestaurantOwner
 ** Method  : GET
 ** Description : this method return all .
 ** Params : .
 */

exports.getAllRestaurantOwner = (req, res, next) => {
  AdminService.getAll("User", "restaurant_owner", req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : getAllOrder
 ** Method  : GET
 ** Description : this method return all .
 ** Params : .
 */

exports.getAllOrder = (req, res, next) => {
  AdminService.getAllOrder(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : getAllMenu
 ** Method  : GET
 ** Description : this method return all .
 ** Params : .
 */

exports.getAllMenu = (req, res, next) => {
  AdminService.getAllMenu(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : getAllRestaurant
 ** Method  : GET
 ** Description : this method return all .
 ** Params : .
 */

exports.getAllRestaurant = (req, res, next) => {
  AdminService.getAll("Restaurant", "", req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : getAllCategory
 ** Method  : GET
 ** Description : this method return all .
 ** Params : .
 */

exports.getAllCategory = (req, res, next) => {
  AdminService.getAll("Category", "", req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : getAllPackage
 ** Method  : GET
 ** Description : this method return all .
 ** Params : .
 */

exports.getAllPackage = (req, res, next) => {
  AdminService.getAll("Package", "", req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : statusChangeSubadmin
 ** Method  : PUT
 ** Description : this method will change the status of admin's data.
 ** Params : .
 */

exports.statusChangeSubadmin = (req, res, next) => {
  AdminService.statusChange("Admin", "subadmin", req.params.id, req.body)
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
  AdminService.statusChange("User", "customer", req.params.id, req.body)
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
  AdminService.statusChange("User", "restaurant_owner", req.params.id, req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : statusChangeOrder
 ** Method  : PUT
 ** Description : this method will change the status of Order's data.
 ** Params : .
 */

exports.statusChangeOrder = (req, res, next) => {
  AdminService.statusChange("Order", "", req.params.id, req.body)
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
  AdminService.statusChange("Menu", "", req.params.id, req.body)
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
  AdminService.statusChange("Restaurant", "", req.params.id, req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : statusChangeCategory
 ** Method  : PUT
 ** Description : this method will change the status of Category's data.
 ** Params : .
 */

exports.statusChangeCategory = (req, res, next) => {
  AdminService.statusChange("Category", "", req.params.id, req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : statusChangePackage
 ** Method  : PUT
 ** Description : this method will change the status of Package's data.
 ** Params : .
 */

exports.statusChangePackage = (req, res, next) => {
  AdminService.statusChange("Package", "", req.params.id, req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : deleteSubadmin
 ** Method  : PUT
 ** Description : this method will delete subadmin's data.
 ** Params : .
 */

exports.deleteSubadmin = (req, res, next) => {
  AdminService.delete("Admin", "subadmin", req.params.id)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
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
  AdminService.delete("User", "customer", req.params.id)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
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
  AdminService.delete("User", "restaurant_owner", req.params.id)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};


/*
 ** Function Name : deleteOrder
 ** Method  : PUT
 ** Description : this method will delete Order's data.
 ** Params : .
 */

exports.deleteOrder = (req, res, next) => {
  AdminService.delete("Order", "", req.params.id)
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
  AdminService.delete("Menu", "", req.params.id)
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
  AdminService.delete("Restaurant", "", req.params.id)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : deleteCategory
 ** Method  : PUT
 ** Description : this method will delete Category's data.
 ** Params : .
 */

exports.deleteCategory = (req, res, next) => {
  AdminService.delete("Category", "", req.params.id)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : deletePackage
 ** Method  : PUT
 ** Description : this method will delete Package's data.
 ** Params : .
 */

exports.deletePackage = (req, res, next) => {
  AdminService.delete("Package", "", req.params.id)
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
  AdminService.getCustomerAllOrders(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
}

/*
 ** Function Name : getRestaurantMenu
 ** Method  : GET
 ** Description : this method is used to get menu of restaurant
 ** Params : .
 */

exports.getRestaurantMenu = (req, res) => {
  AdminService.getRestaurantMenu(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
}
/*
 ** Function Name : getRestaurantOrders
 ** Method  : GET
 ** Description : this method is used to get Orders of restaurant
 ** Params : .
 */

exports.getRestaurantOrders = (req, res) => {
  AdminService.getRestaurantOrders(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
}

/*
 ** Function Name : deliveryStatusChangeRestaurant
 ** Method  : PUT
 ** Description : this method will change the status of Restaurant's data.
 ** Params : .
 */

exports.deliveryStatusChangeRestaurant = (req, res, next) => {
  AdminService.deliveryStatusChangeRestaurant(req.params.id, req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : createSubAdmin
 ** Method  : PUT
 ** Description : this method will create Admin.
 ** Params : .
 */

exports.createSubAdmin = (req, res, next) => {
  AdminService.createSubAdmin(req, res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      if (error.message.includes('email')) {
        error.message = "Email already exist"
        error.code = 400
      }
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};


/*
 ** Function Name : createCategory
 ** Method  : PUT
 ** Description : this method will edit.
 ** Params : .
 */

exports.createCategory = (req, res, next) => {
  AdminService.createCategory(req, res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : createPackage
 ** Method  : PUT
 ** Description : this method will edit.
 ** Params : .
 */

exports.createPackage = (req, res, next) => {
  AdminService.createPackage(req, res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      if (error.message.includes('name')) {
        error.message = "Package Name already exist"
        error.code = 400
      }
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : editSubadmin
 ** Method  : PUT
 ** Description : this method will edit subadmin.
 ** Params : .
 */

exports.editSubadmin = (req, res, next) => {
  AdminService.editSubadmin(req, res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      if (error.message.includes('email')) {
        error.message = "Email already exist"
        error.code = 400
      }
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : editCustomer
 ** Method  : PUT
 ** Description : this method will edit.
 ** Params : .
 */

exports.editCustomer = (req, res, next) => {
  AdminService.editCustomer(req, res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      if (error.message.includes('email')) {
        error.message = "Email already exist"
        error.code = 400
      }
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : editRestaurantOwner
 ** Method  : PUT
 ** Description : this method will edit.
 ** Params : .
 */

exports.editRestaurantOwner = (req, res, next) => {
  AdminService.editVendor(req, res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      if (error.message.includes('email')) {
        error.message = "Email already exist"
        error.code = 400
      }
      else if (error.message.includes('businessName')) {
        error.message = "Business/Restaurant Name already exist"
        error.code = 400
      }
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : editMenu
 ** Method  : PUT
 ** Description : this method will edit.
 ** Params : .
 */

exports.editMenu = (req, res, next) => {
  AdminService.editMenu(req, res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : editRestaurant
 ** Method  : PUT
 ** Description : this method will edit.
 ** Params : .
 */

exports.editRestaurant = (req, res, next) => {
  AdminService.editRestaurant(req, res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : editCategory
 ** Method  : PUT
 ** Description : this method will edit.
 ** Params : .
 */

exports.editCategory = (req, res, next) => {
  AdminService.editCategory(req, res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : editPackage
 ** Method  : PUT
 ** Description : this method will edit.
 ** Params : .
 */

exports.editPackage = (req, res, next) => {
  AdminService.editPackage(req, res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      if (error.message.includes('name')) {
        error.message = "Subscription Name already exist"
        error.code = 400
      }
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : getSuperuser
 ** Method  : GET
 ** Description : this method returns single admin.
 ** Params : .
 */

exports.getSuperuser = (req, res, next) => {
  id = req.user.id
  AdminService.getSuperuser(id)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
}

/*
 ** Function Name : getSubadminPermissions
 ** Method  : GET
 ** Description : this method returns single admin.
 ** Params : .
 */

exports.getSubadminPermissions = (req, res, next) => {
  id = req.user.id
  AdminService.getSubadminPermissions(id)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
}

/*
 ** Function Name : editSuperuser
 ** Method  : PUT
 ** Description : this method will edit admin's data.
 ** Params : .
 */

exports.editSuperuser = (req, res, next) => {
  AdminService.editSuperuser(req, res)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : changePasswordSuperuser
 ** Method  : PUT
 ** Description : this method will changePassword admin's data.
 ** Params : .
 */

exports.changePasswordSuperuser = (req, res, next) => {
  AdminService.changePasswordSuperuser(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};



/*
 ** Function Name : seedAdmin
 ** Method  : POST
 ** Description : this method will create super admin.
 ** Params : .
 */

exports.seedAdmin = (req, res, next) => {
  AdminService.seed()
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : loginAdmin
 ** Method  : POST
 ** Description : this method will login Admin.
 ** Params : .
 */

exports.loginAdmin = (req, res, next) => {
  AdminService.login(req)
    .then((results) => {
      return responseHandler.resHandler(true, results, "You are successfully logged in.", res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : forgotPasswordAdmin
 ** Method  : POST
 ** Description : this method is used for forgotPassword.
 ** Params : .
 */

exports.forgotPasswordAdmin = (req, res, next) => {
  CommonService.forgotPassword("Admin", "", req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, "", res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : resetPasswordAdmin
 ** Method  : POST
 ** Description : this method is used for resetPassword.
 ** Params : .
 */

exports.resetPasswordAdmin = (req, res, next) => {
  CommonService.resetPassword("Admin", "", req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, "Your Password has been Changed Succesfully", res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : imageUploadAdmin
 ** Method  : POST
 ** Description : this method will upload image of customer.
 ** Params : .
 */

exports.imageUploadAdmin = (req, res, next) => {
  CommonService.imageUpload("Admin", req, "admin", "profilePicture")
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

