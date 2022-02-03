/*
 ** Load Modules **
 */
const express = require("express");
const app = express();
const sanitizer = require("sanitize")();

app.use(require("sanitize").middleware);

/** Services   */
const CommonService = require("../common/common.services");
const OrderService = require("./order.services")
const tableJson = require("../../config/table.json");

/* ## Include libraries  */
const responseHandler = require("../../utility/responseHandler");
const striptags = require("striptags");

/*
 ** Function Name : getSingleOrder
 ** Method  : GET
 ** Description : this method returns single Order.
 ** Params : .
 */

exports.getSingleOrder = (req, res, next) => {
  CommonService.getSingle("Order", "", req.params.id)
  .then((results) => {
    return responseHandler.resHandler(true, results, {}, res, 200);
  })
  .catch((error) => {
    return responseHandler.resHandler(false, {}, error.message, res, error.code);
  });
}


/*
 ** Function Name : createOrder
 ** Method  : PUT
 ** Description : this method will create Order.
 ** Params : .
 */

exports.createOrder = (req, res, next) => {
  orderObject = {
    customerId : req.user.id,
    restaurantId : req.body.i,
    orderDetails : req.body.order,
    totalPrice : req.body.subTotal,
    totalPriceWithDiscount : req.body.total,
    orderType: req.body.orderType,
    orderId : null

  };
  console.log("req.body.order",req.body.order);
  console.log("orderObject",orderObject);

  OrderService.createOrder(orderObject)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name :editOrder
 ** Method  : PUT
 ** Description : this method will edit Order's data.
 ** Params : .
 */

exports.editOrder = (req, res, next) => {
  CommonService.edit("Order", "", req)
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
  CommonService.delete("Order", "", req.params.id)
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
  CommonService.statusChange("Order", "", req.params.id, req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};



/*
 ** Function Name : getCustomerOrder
 ** Method  : GET
 ** Description : this method returns single Order.
 ** Params : .
 */

exports.getCustomerOrder = (req, res, next) => {
  OrderService.getCustomerOrder(req)
  .then((results) => {
    return responseHandler.resHandler(true, results, {}, res, 200);
  })
  .catch((error) => {
    return responseHandler.resHandler(false, {}, error.message, res, error.code);
  });
}



/*
 ** Function Name : getVendorOrder
 ** Method  : GET
 ** Description : this method returns single Order.
 ** Params : .
 */

exports.getVendorOrder = (req, res, next) => {
  OrderService.getVendorOrder(req)
  .then((results) => {
    return responseHandler.resHandler(true, results, {}, res, 200);
  })
  .catch((error) => {
    return responseHandler.resHandler(false, {}, error.message, res, 500);
  });
}

/*
 ** Function Name : getNotifications
 ** Method  : GET
 ** Description : this method returns single Order.
 ** Params : .
 */

exports.getNotifications = (req, res, next) => {
  OrderService.getNotifications(req)
  .then((results) => {
    return responseHandler.resHandler(true, results, {}, res, 200);
  })
  .catch((error) => {
    return responseHandler.resHandler(false, {}, error.message, res, 500);
  });
}