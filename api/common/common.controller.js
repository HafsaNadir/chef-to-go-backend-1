/*
 ** Load Modules **
 */
const express = require("express");
const app = express();
const sanitizer = require("sanitize")();

app.use(require("sanitize").middleware);

/** Services   */
const CommonService = require("../common/common.services");

/* ## Include libraries  */
const responseHandler = require("../../utility/responseHandler");
const striptags = require("striptags");

const User = require('../models/User')
const mailService = require('../../lib/mail.service')
const md5 = require('md5')
const config = require('../../config/environment');

/*
 ** Function Name : getProfile
 ** Method  : GET
 ** Description : this method returns single admin.
 ** Params : .
 */

exports.getProfile = (req, res, next) => {
    id = req.user.id
    CommonService.getProfile(id)
    .then((results) => {
        return responseHandler.resHandler(true, results, {}, res, 200); 
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
}

/*
 ** Function Name : editProfile
 ** Method  : PUT
 ** Description : this method will edit data.
 ** Params : .
 */

exports.editProfile = (req, res, next) => {
    CommonService.editProfile(req,res)
    .then((results) => {
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
** Function Name : changeProfilePassword
** Method  : PUT
** Description : this method will change Password data.
** Params : .
*/
  
exports.changeProfilePassword = (req, res, next) => {
    CommonService.changeProfilePassword(req)
    .then((results) => {
        return responseHandler.resHandler(true, results, {}, res, 200);
    })
    .catch((error) => {
        return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};
  

/*
** Function Name : emailVerification
** Method  : POST
** Description : this method use for email verification .
** Params : ref id 
*/
exports.verifyEmail = (req, res, next) => {
    let hash = req.params.hash;
    let refId = req.params.id;
    let obj = { _id: refId, emailHash: hash }
    console.log('hii')
    console.log(obj)
    User.findOne({ _id: refId, emailHash: hash })
      .then(user => {
        if (user) {
          if (!user.isEmailVerified) {
            User.findOneAndUpdate({ _id: refId, emailHash: hash },
              {
                $set: {
                  'isEmailVerified': true
                }
              },
              { new: true })
              .then(userData => {
                mailService.userWelcome(userData.email, userData.firstName);
                return responseHandler.resHandler(true, {}, 'Your email has been successfully confirmed.', res, 200);
              }).catch(err => {
                return responseHandler.resHandler(false, {}, 'Something Went Wrong', res, 500);
              });
  
          }
          else {
            return responseHandler.resHandler(false, {}, 'Email already verified', res, 200);
            
          }
        }
        else {
          return responseHandler.resHandler(false, {}, 'Invalid confirmation URL', res, 400);
        }
      })
      .catch(error => {
        return responseHandler.resHandler(false, {}, 'Something Went Wrong '+error, res, 500);
      });
  };
  
  
  /*
  ** Function Name : emailResend
  ** Method  : POST
  ** Description : this method use for emailResend .
  ** Params : ref id 
  */
  // RESEND EMAIL ON ACCOUNT VERIFICATION PAGE
  exports.emailResend = (req, res, next) => {
    // if (validation.isEmpty(req.body.refId)) {
    //   return responseHandler.resHandler(false, {}, 'Something went wrong', res, 400);
    // }
    console.log(req.body.refId)
    User.findOne({ _id: req.body.refId })
      .then(user => {
        console.log(user)
        if (!user) {
          return responseHandler.resHandler(false, null, 'Something went wrong', res, 400);
        }
        else if (user) {
          if (user.isEmailVerified) {
            return responseHandler.resHandler(false, null, 'Email address already verified.', res, 400);
          }
          else {
            let date = new Date();
            let timestamp = date.getTime();
            let emailHash = md5(user.email + timestamp);
            let attempt = user.emailResendAttempt + 1;
            if (user.emailResendAttempt == 2 && user.emailResendDate > date) {
              return responseHandler.resHandler(false, {}, 'You can request another verification email after 30 minutes.', res, 400);
            }
            else if (user.emailResendAttempt == 2) {
              attempt = 1;
            }
            date.setMinutes(date.getMinutes() + 30);
            User.findOneAndUpdate({ _id: user._id },
              {
                $set: {
                  'emailHash': emailHash,
                  'emailResendAttempt': attempt,
                  'emailResendDate': date
                }
              },
              { new: true })
              .then(userData => {
                let link = config.baseUrl + 'email/verification/' + emailHash + '/' + user._id;
                emailResp = mailService.emailVerification(user.email, user.firstName, link);
                return responseHandler.resHandler(true, 'A new verification email has just been sent to you.', '', res, 200);
              }).catch(err => {
                return responseHandler.resHandler(false, {}, 'Something Went Wrong', res, 500);
              });
          }
        }
      })
      .catch(error => {
        return responseHandler.resHandler(false, {}, 'Something Went Wrong ' + error, res, 500);
      });
  };
  
  
/*
 ** Function Name : forgotPassword
 ** Method  : POST
 ** Description : this method is used for forgotPassword.
 ** Params : .
 */

exports.forgotPassword = (req, res, next) => {
  CommonService.forgotPassword( req.body)
    .then((results) => {
      return responseHandler.resHandler(true, results, "", res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};

/*
 ** Function Name : resetPassword
 ** Method  : GET
 ** Description : this method is used for resetPassword.
 ** Params : .
 */

exports.resetPassword = (req, res, next) => {
  CommonService.resetPassword(req)
    .then((results) => {
      return responseHandler.resHandler(true, "Your Password has been Changed Successfully", "", res, 200);
    })
    .catch((error) => {
      return responseHandler.resHandler(false, {}, error.message, res, error.code);
    });
};
