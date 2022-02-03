/*
 ** Load Modules **
 */
const express = require("express");
const app = express();
const sanitizer = require("sanitize")();

app.use(require("sanitize").middleware);

/** Services   */
const CommonService = require("../common/common.services");
const CategoryService = require("../category/category.services");
const tableJson = require("../../config/table.json");

/* ## Include libraries  */
const responseHandler = require("../../utility/responseHandler");
const striptags = require("striptags");


/*
 ** Function Name : getAllCategory
 ** Method  : GET
 ** Description : this method return all .
 ** Params : .
 */

exports.getAllCategory = (req, res, next) => {
  CommonService.getAll("Category", "", req)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : getSingleCategory
 ** Method  : GET
 ** Description : this method returns single Category.
 ** Params : .
 */

exports.getSingleCategory = (req, res, next) => {
  CommonService.getSingle("Category", "", req.params.id)
  .then((results) => {
    return responseHandler.resHandler(true, results, {}, res, 200);
  })
  .catch((error) => {
    return responseHandler.resHandler(false, {}, error.message, res, error.code);
  });
}

/*
 ** Function Name : createCategory
 ** Method  : PUT
 ** Description : this method will create Category.
 ** Params : .
 */

exports.createCategory = (req, res, next) => {
  CategoryService.createCategory(req, res)
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
 ** Description : this method will edit Category's data.
 ** Params : .
 */

exports.editCategory = (req, res, next) => {
  CommonService.edit("Category", "", req)
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
  CommonService.delete("Category","", req.params.id)
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
  CommonService.statusChange("Category","", req.params.id, req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : imageUploadCategory
 ** Method  : POST
 ** Description : this method will upload image of customer.
 ** Params : .
 */

exports.imageUploadCategory = (req, res, next) => {
  CommonService.imageUpload("Category", req, "admin", "image")
    .then((results) => {
      return responseHandler.resHandler(true, results, {} , res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};