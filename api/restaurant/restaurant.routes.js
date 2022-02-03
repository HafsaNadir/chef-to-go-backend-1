const express = require('express');

const router = express.Router();
const restaurantController = require('./restaurant.controller');

// Middleware
const auth = require("../middleware/user.auth");
router.get('/',auth.vendorAuth , restaurantController.getMyRestaurant);
router.get('/home' , restaurantController.getAllRestaurant);
router.get('/search', restaurantController.getAllRestaurant);
router.get('/slug/:slug', restaurantController.getRestaurantBySlug);

router.get('/:id', restaurantController.getSingleRestaurant);

router.post('/', restaurantController.createRestaurant);
router.put('/edit',auth.vendorAuth , restaurantController.editRestaurant);
router.put('/edit/preferences', auth.vendorAuth, restaurantController.editPreferences)
router.put('/edit/time', auth.vendorAuth, restaurantController.editTimings)
router.put('/edit/location', auth.vendorAuth, restaurantController.editLocation)

router.put('/delete/:id', restaurantController.deleteRestaurant);
router.put('/status/:id', restaurantController.statusChangeRestaurant);
router.put('/delivery_status/:id', restaurantController.deliveryStatusChangeRestaurant);
router.post('/image',auth.vendorAuth , restaurantController.imageUploadRestaurant);
router.post('/image/cover',auth.vendorAuth , restaurantController.coverImageUploadRestaurant);
router.get('/all_orders/:id', restaurantController.getRestaurantAllOrders)

module.exports = router