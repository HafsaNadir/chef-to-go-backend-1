const express = require('express');
const commonController = require('./common.controller');
const auth = require('../middleware/user.auth');

const router = express.Router();

router.put('/edit', auth.auth, commonController.editProfile);
router.get('/', auth.auth, commonController.getProfile);
router.put('/edit/password', auth.auth, commonController.changeProfilePassword);

router.get("/email/verification/:hash/:id", function(req, res, next) {
    console.log("here");
    commonController.verifyEmail(req, res, next);
  });

router.post('/email/resend', commonController.emailResend);

router.post('/forgotPassword', commonController.forgotPassword);
router.post('/reset/:hash/:id', commonController.resetPassword);

module.exports = router;
