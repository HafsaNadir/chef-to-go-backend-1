/*
 ** Load Modules **
 */
const express = require("express");
const app = express();

/* ## Include libraries  */
const responseHandler = require("../../utility/responseHandler");
const striptags = require("striptags");

const DashboardService = require('./dashboard.services')

exports.totalCustomers = (req, res, next) => {
    DashboardService.totalCustomers(req)
    .then((results) => { 
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

exports.totalChefs = (req, res, next) => {
    DashboardService.totalChefs(req)
    .then((results) => { 
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

exports.totalResOwners = (req, res, next) => {
    DashboardService.totalResOwners(req)
    .then((results) => { 
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

exports.totalOrders = (req, res, next) => {
    DashboardService.totalOrders(req)
    .then((results) => { 
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

exports.completedOrders = (req, res, next) => {
    DashboardService.completedOrders(req)
    .then((results) => { 
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

exports.totalSales = (req, res, next) => {
    DashboardService.totalSales(req)
    .then((results) => { 
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

exports.cancelledOrders = (req, res, next) => {
    DashboardService.cancelledOrders(req)
    .then((results) => { 
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

exports.resOwnerReq = (req, res, next) => {
    DashboardService.resOwnerReq(req)
    .then((results) => { 
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

exports.todayCancelOrders = (req, res, next) => {
    DashboardService.todayCancelOrders()
    .then((results) => { 
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

exports.todayPendingOrders = (req, res, next) => {
    DashboardService.todayPendingOrders()
    .then((results) => { 
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

exports.menuReq = (req, res, next) => {
    DashboardService.menuReq(req)
    .then((results) => { 
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

exports.totalRestaurants = (req, res, next) => {
    DashboardService.totalRestaurants(req)
    .then((results) => { 
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};
