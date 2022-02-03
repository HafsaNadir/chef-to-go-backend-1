const express = require('express');

const router = express.Router();
const adminController = require('./admin.controller');
const auth = require('../middleware/user.auth');

//listing apis
router.get('/admin', auth.adminAuth, adminController.getAllSubadmin);
router.get('/customer', auth.adminAuth, adminController.getAllCustomer);
router.get('/restaurant_owner', auth.adminAuth, adminController.getAllRestaurantOwner);
router.get('/order', auth.adminAuth, adminController.getAllOrder);
router.get('/menu', auth.adminAuth, adminController.getAllMenu)
router.get('/restaurant', auth.adminAuth, adminController.getAllRestaurant)
router.get('/category', auth.adminAuth, adminController.getAllCategory)
router.get('/package', auth.adminAuth, adminController.getAllPackage)

//edit apis
router.put('/admin/edit/:id', auth.adminAuth, adminController.editSubadmin);
router.put('/customer/edit/:id', auth.adminAuth, adminController.editCustomer);
router.put('/restaurant_owner/edit/:id', auth.adminAuth, adminController.editRestaurantOwner);
//router.put('/order/edit/:id', auth.adminAuth, adminController.editOrder);
router.put('/menu/edit/:id', auth.adminAuth, adminController.editMenu);
router.put('/restaurant/edit/:id', auth.adminAuth, adminController.editRestaurant);
router.put('/category/edit/:id', auth.adminAuth, adminController.editCategory);
router.put('/package/edit/:id', auth.adminAuth, adminController.editPackage);

//delete apis
router.put('/admin/delete/:id', auth.adminAuth, adminController.deleteSubadmin);
router.put('/customer/delete/:id', auth.adminAuth, adminController.deleteCustomer);
router.put('/restaurant_owner/delete/:id', auth.adminAuth, adminController.deleteRestaurantOwner);
router.put('/order/delete/:id', auth.adminAuth, adminController.deleteOrder);
router.put('/menu/delete/:id', auth.adminAuth, adminController.deleteMenu);
router.put('/restaurant/delete/:id', auth.adminAuth, adminController.deleteRestaurant);
router.put('/category/delete/:id', auth.adminAuth, adminController.deleteCategory);
router.put('/package/delete/:id', auth.adminAuth, adminController.deletePackage);

//status change apis
router.put('/admin/status/:id', auth.adminAuth, adminController.statusChangeSubadmin);
router.put('/customer/status/:id', auth.adminAuth, adminController.statusChangeCustomer);
router.put('/restaurant_owner/status/:id', auth.adminAuth, adminController.statusChangeRestaurantOwner);
router.put('/order/status/:id', auth.adminAuth, adminController.statusChangeOrder);
router.put('/menu/status/:id', auth.adminAuth, adminController.statusChangeMenu);
router.put('/restaurant/status/:id', auth.adminAuth, adminController.statusChangeRestaurant);
router.put('/category/status/:id', auth.adminAuth, adminController.statusChangeCategory);
router.put('/package/status/:id', auth.adminAuth, adminController.statusChangePackage);

//extra
router.get('/customer/all_orders/:id', auth.adminAuth, adminController.getCustomerAllOrders)
router.get('/restaurant/all_menus/:id', auth.adminAuth, adminController.getRestaurantMenu)
router.get('/restaurant/all_orders/:id', auth.adminAuth, adminController.getRestaurantOrders)
router.put('/delivery_status/:id', auth.adminAuth, adminController.deliveryStatusChangeRestaurant);

//create
router.post('/admin', auth.adminAuth, adminController.createSubAdmin)
router.post('/category', auth.adminAuth, adminController.createCategory)
router.post('/package', auth.adminAuth, adminController.createPackage)

//superadmin 
router.put('/edit', auth.adminAuth, adminController.editSuperuser);
router.get('/', auth.adminAuth, adminController.getSuperuser);
router.put('/edit/password', auth.adminAuth, adminController.changePasswordSuperuser);

router.post('/seed', adminController.seedAdmin)
router.post('/login', adminController.loginAdmin)
router.post('/forgotPassword', adminController.forgotPasswordAdmin);
router.post('/reset/:hash/:id', adminController.resetPasswordAdmin);
router.post('/image', adminController.imageUploadAdmin);

router.get('/admin/permissions', auth.adminAuth, adminController.getSubadminPermissions);
router.get('/admin/validate', adminController.adminValidate);

module.exports = router;
