const jwt = require("jsonwebtoken");
const config = require('../../config/environment');

const CustomerService = require('../customer/customer.services');
const AdminService = require('../admin/admin.services')

exports.customerAuth = function (req, res, next) {
    //get the token from the header if present
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    //if no token found, return response (without going to the next middelware)
    if (!token) return res.status(401).json({"error":"Access denied. No token provided."});

    try {
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, config.secrets.key);
        req.user = decoded;

        // Verify user exists in database
        CustomerService.customerFindById(decoded,'customer').then(results => {
            next();
        })
            .catch(error => {
                res.status(400).json({"error" :"Invalid token."});
            });
    } catch (ex) {
        //if invalid token
        res.status(400).json({"error" :"Invalid token."});
    }
};

exports.vendorAuth = function (req, res, next) {
    //get the token from the header if present
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    //if no token found, return response (without going to the next middelware)
    if (!token) return res.status(401).json({"error":"Access denied. No token provided."});

    try {
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, config.secrets.key);
        req.user = decoded;

        // Verify user exists in database
        console.log('decoded',decoded);
        CustomerService.customerFindById(decoded,'restaurant_owner').then(results => {
            next();
        })
            .catch(error => {
                res.status(400).json({"error" :"Invalid token."});
            });
    } catch (ex) {
        //if invalid token
        res.status(400).json({"error" :"Invalid token."});
    }
};

exports.adminAuth = function (req, res, next) {
    //get the token from the header if present
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    //if no token found, return response (without going to the next middelware)
    if (!token) return res.status(401).json({"error":"Access denied. No token provided."});

    try {
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, config.secrets.key);
        req.user = decoded;

        // Verify user exists in database
        // console.log('decoded',decoded);
        AdminService.adminFindById(decoded).then(results => {
            next();
        })
        .catch(error => {
            res.status(400).json({"error" :"Invalid token."});
        });
    } catch (ex) {
        //if invalid token
        res.status(400).json({"error" :"Invalid token."});
    }
};


exports.auth = function (req, res, next) {
    //get the token from the header if present
    const token = req.headers["x-access-token"] || req.headers["authorization"];
    //if no token found, return response (without going to the next middelware)
    if (!token) return res.status(401).json({"error":"Access denied. No token provided."});

    try {
        //if can verify the token, set req.user and pass to next middleware
        const decoded = jwt.verify(token, config.secrets.key);
        req.user = decoded;

        // Verify user exists in database
        console.log('decoded',decoded);
        CustomerService.customerFindById(decoded,'restaurant_owner').then(results => {
            next();
        })
            .catch(error => {
                CustomerService.customerFindById(decoded,'customer').then(results => {
                    next();
                })
                .catch((err) => {
                    res.status(400).json({"error" :"Invalid token."});
                })
            });
    } catch (ex) {
        //if invalid token
        res.status(400).json({"error" :"Invalid token."});
    }
};
