const express = require('express');

const router = express.Router();
const menuController = require('./menu.controller');
const auth = require('../middleware/user.auth');
//router.get('/', menuController.getAllMenu);
router.post('/',auth.vendorAuth, menuController.createMenu);

router.put('/edit/:id',auth.vendorAuth, menuController.editMenu);
router.put('/delete/:id', menuController.deleteMenu);
router.put('/status/:id',auth.vendorAuth,  menuController.statusChangeMenu);
router.post('/image', menuController.imageUploadMenu);
router.get('/vendor',auth.vendorAuth, menuController.getVendorMenu);
router.get('/restaurant/:id',auth.vendorAuth, menuController.getRestaurantMenu);
router.put('/discount/:id',auth.vendorAuth, menuController.addDiscountMenu);

router.post('/vendor/variation/:id',auth.vendorAuth, menuController.addVariation);


module.exports = router