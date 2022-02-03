const express = require('express');

const router = express.Router();
const auth = require('../middleware/user.auth');

const dashboardController = require('./dashboard.controller')

router.get('/totalCustomers', auth.adminAuth, dashboardController.totalCustomers)
router.get('/totalChefs', auth.adminAuth, dashboardController.totalChefs)
router.get('/totalResOwners', auth.adminAuth, dashboardController.totalResOwners)
router.get('/totalOrders', auth.adminAuth, dashboardController.totalOrders)
router.get('/completedOrders',auth.adminAuth, dashboardController.completedOrders)
router.get('/totalSales', auth.adminAuth, dashboardController.totalSales)
router.get('/cancelledOrders',auth.adminAuth, dashboardController.cancelledOrders)
router.get('/resOwnerReq', auth.adminAuth, dashboardController.resOwnerReq)
router.get('/todayCancelOrders',auth.adminAuth, dashboardController.todayCancelOrders)
router.get('/todayPendingOrders', auth.adminAuth, dashboardController.todayPendingOrders)
router.get('/menuReq', auth.adminAuth, dashboardController.menuReq)
router.get('/totalRestaurants', auth.adminAuth, dashboardController.totalRestaurants)

module.exports = router