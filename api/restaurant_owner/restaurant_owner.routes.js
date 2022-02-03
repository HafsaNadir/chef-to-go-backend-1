const express = require('express');

const router = express.Router();
const restaurantOwnerController = require('./restaurant_owner.controller');

router.post('/', restaurantOwnerController.createRestaurantOwner);
router.post('/login', restaurantOwnerController.loginRestaurantOwner)
router.post('/login/social', restaurantOwnerController.socialLoginVendor)
router.get('/:id', restaurantOwnerController.getSingleRestaurantOwner);
router.put('/edit/:id', restaurantOwnerController.editRestaurantOwner);
router.put('/delete/:id', restaurantOwnerController.deleteRestaurantOwner);
router.put('/status/:id', restaurantOwnerController.statusChangeRestaurantOwner);

module.exports = router;
