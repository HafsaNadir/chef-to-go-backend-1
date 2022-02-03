const express = require('express');

const router = express.Router();
const categoryController = require('./category.controller');

router.get('/', categoryController.getAllCategory)
router.get('/:id', categoryController.getSingleCategory)
router.post('/', categoryController.createCategory);
router.put('/edit/:id', categoryController.editCategory);
router.put('/delete/:id', categoryController.deleteCategory);
router.put('/status/:id', categoryController.statusChangeCategory);
router.post('/image', categoryController.imageUploadCategory);

module.exports = router;