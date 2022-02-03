const express = require('express');

const router = express.Router();
const orderController = require('./order.controller');


// Middleware
const auth = require("../middleware/user.auth");
router.get('/vendor',auth.vendorAuth, orderController.getVendorOrder);
router.get('/notification', auth.customerAuth, orderController.getNotifications )
router.post('/',auth.customerAuth, orderController.createOrder);
router.get('/:id', orderController.getSingleOrder);
router.get('/',auth.customerAuth, orderController.getCustomerOrder);


router.put('/edit/:id', orderController.editOrder);
router.put('/delete/:id', orderController.deleteOrder);
router.put('/status/:id', orderController.statusChangeOrder);

module.exports = router;
