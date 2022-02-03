const express = require('express');

const router = express.Router();
const auth = require('../middleware/user.auth');

const customerController = require('./customer.controller');
router.get('/validate', customerController.customerValidate);
router.post('/', customerController.createCustomer);
router.post('/login', customerController.loginCustomer)
router.post('/login/social', customerController.socialLoginCustomer)
router.get('/:id', customerController.getSingleCustomer);
//router.put('/edit/:id', customerController.editCustomer);
router.put('/delete/:id', customerController.deleteCustomer);
router.put('/status/:id', customerController.statusChangeCustomer);
router.get('/all_orders/:id', customerController.getCustomerAllOrders)
router.post('/image', customerController.imageUploadCustomer);

router.put('/edit/addr', auth.customerAuth, customerController.editAddr);
router.put('/edit/details', auth.customerAuth, customerController.editDetails);

module.exports = router;
