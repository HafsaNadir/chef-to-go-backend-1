const mailer = require('express-mailer');
const config = require('../config/environment');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');

mailer.extend(app, {
  from: '"Cheftogo" <phpsols.developer@gmail.com>',
  host: 'smtp.gmail.com', // hostname
  secureConnection: false, // use SSL
  port: 587, // port for secure SMTP
  // transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
    user: 'phpsols.developer',
    pass: 'dydfucdhnijgywbu',
  },
});

/*****************************************************************/
/* ============== ACCOUNTS MODULE EMAIL TEMPLATES ============== */
/*****************************************************************/

// EMAIL VERIFICATION
exports.emailVerification = emailVerification = (email, name, link) => {

  app.mailer.send('emailTemplates/accounts/signup', {
    to: email,
    subject: 'Activate your Cheftogo account',
    nameProperty: name,
    linkProperty: link,
    baseUrl:config.baseUrl
  }, (mailErr) => {
    console.log('mailErr', mailErr);
    // return helper.resHandler(false, null, mailErr, res, 500);
  //  console.log(' noo mailErr');
    // return helper.resHandler(true, saveUser, null, res, 200);
  });
}

// ACCOUNT WELCOME
exports.userWelcome = userWelcome = (email, name) => {

  app.mailer.send('emailTemplates/accounts/welcome', {
    to: email,
    subject: 'Welcome to Cheftogo',
    nameProperty: name,
    baseUrl:config.baseUrl
  }, (mailErr) => {
    console.log('mailErr', mailErr);
    // return helper.resHandler(false, null, mailErr, res, 500);
    console.log(' noo mailErr');
    // return helper.resHandler(true, saveUser, null, res, 200);
  });
}

// IDENTITY VERIFICATION
exports.profileVerified = profileVerified = (email, name) => {

  app.mailer.send('emailTemplates/accounts/profile-verified', {
    to: email,
    subject: 'Identitiy verified by Cheftogo',
    nameProperty: name,
    baseUrl:config.baseUrl
  }, (mailErr) => {
    console.log('mailErr', mailErr);
    // return helper.resHandler(false, null, mailErr, res, 500);
    console.log(' noo mailErr');
    // return helper.resHandler(true, saveUser, null, res, 200);
  });
}

// RESET PASSWORD
exports.forgotPassword = forgotPassword = (email, name, link) => {

  app.mailer.send('emailTemplates/accounts/forgot_password', {
    to: email,
    subject: 'Reset your Cheftogo password',
    nameProperty: name,
    link: link,
    baseUrl:config.baseUrl
  }, (mailErr) => {
    console.log('mailErr', mailErr);
    // return helper.resHandler(false, null, mailErr, res, 500);
    console.log(' noo mailErr');
    // return helper.resHandler(true, saveUser, null, res, 200);
  });
}

// ACCOUNT PASSWORD CHANGED
exports.userChangedPassword = userChangedPassword = (email, name) => {

  app.mailer.send('emailTemplates/accounts/password-changed', {
    to: email,
    subject: 'Your Cheftogo password has changed',
    nameProperty: name,
    baseUrl:config.baseUrl
  }, (mailErr) => {
    console.log('mailErr', mailErr);
    // return helper.resHandler(false, null, mailErr, res, 500);
    console.log(' noo mailErr');
    // return helper.resHandler(true, saveUser, null, res, 200);
  });
}

// ACCOUNT EMAIL CHANGED
exports.userEmailChanged = userEmailChanged = (email, name) => {

  app.mailer.send('emailTemplates/accounts/email-changed', {
    to: email,
    subject: 'Your Cheftogo email has changed',
    nameProperty: name,
    baseUrl:config.baseUrl
  }, (mailErr) => {
    console.log('mailErr', mailErr);
    // return helper.resHandler(false, null, mailErr, res, 500);
    console.log(' noo mailErr');
    // return helper.resHandler(true, saveUser, null, res, 200);
  });
}

// HOST ACCESS RESTRICTION
exports.accountRestriction = accountRestriction = (email, name) => {

  app.mailer.send('emailTemplates/accounts/account-restriction', {
    to: email,
    subject: 'Your account has been restricted',
    nameProperty: name,
    baseUrl:config.baseUrl
  }, (mailErr) => {
    console.log('mailErr', mailErr);
    // return helper.resHandler(false, null, mailErr, res, 500);
    console.log(' noo mailErr');
    // return helper.resHandler(true, saveUser, null, res, 200);
  });
}

// ACCOUNT DISABLED
exports.changeUserStatus = changeUserStatus = (email, name) => {

  app.mailer.send('emailTemplates/accounts/account-disabled', {
    to: email,
    subject: 'Your account has been disabled',
    nameProperty: name,
    baseUrl:config.baseUrl
  }, (mailErr) => {
    console.log('mailErr', mailErr);
    // return helper.resHandler(false, null, mailErr, res, 500);
    console.log(' noo mailErr');
    // return helper.resHandler(true, saveUser, null, res, 200);
  });
}

/*****************************************************************/
/* ============== VEHICLE MODULE EMAIL TEMPLATES =============== */
/*****************************************************************/

// PENDING VEHICLE
exports.PendingVehicleEmail = VehiclePending = (subject,name,email) => {

    app.mailer.send('emailTemplates/vehicles/vehicle-pending', {
      to: email,
      subject: 'Your '+subject+' is under review',
      name : name,
      baseUrl:config.baseUrl
    }, (mailErr) => {
      console.log('mailErr', mailErr);
      // return helper.resHandler(false, null, mailErr, res, 500);
      console.log(' noo mailErr');
      // return helper.resHandler(true, saveUser, null, res, 200);
    });
  }

// VEHICLE APPROVAL 
exports.ApprovedVehicleEmail = ApprovedVehicleEmail = (subject,name,email,heading,url) => {

  app.mailer.send('emailTemplates/vehicles/vehicle-approved', {
    to: email,
    subject: subject,
    name : name,
    heading : heading,
    baseUrl:config.baseUrl,
    url:url
  }, (mailErr) => {
    console.log('mailErr', mailErr);
    // return helper.resHandler(false, null, mailErr, res, 500);
    console.log(' noo mailErr');
    // return helper.resHandler(true, saveUser, null, res, 200);
  });
}

// HOLD VEHICLE
exports.HoldVehicleEmail = HoldVehicleEmail = (subject,name,email) => {

  app.mailer.send('emailTemplates/vehicles/vehicle-hold', {
    to: email,
    subject: subject,
    name : name,
    baseUrl:config.baseUrl
  }, (mailErr) => {
    console.log('mailErr', mailErr);
    // return helper.resHandler(false, null, mailErr, res, 500);
    console.log(' noo mailErr');
    // return helper.resHandler(true, saveUser, null, res, 200);
  });
}

// DEACTIVATE VEHICLE
exports.DeactivatedVehicleEmail = DeactivatedVehicleEmail = (subject,name,email) => {

  app.mailer.send('emailTemplates/vehicles/vehicle-deactivate', {
    to: email,
    subject: subject,
    name : name,
    baseUrl:config.baseUrl
  }, (mailErr) => {
    console.log('mailErr', mailErr);
    // return helper.resHandler(false, null, mailErr, res, 500);
    console.log(' noo mailErr');
    // return helper.resHandler(true, saveUser, null, res, 200);
  });
}

// REACTIVATE VEHICLE
exports.ReactivateVehicleEmail = ReactivateVehicleEmail = (subject,name,email,heading,url) => {

  app.mailer.send('emailTemplates/vehicles/vehicle-reactivate', {
    to: email,
    subject: subject,
    name : name,
    heading : heading,
    url : url,
    baseUrl:config.baseUrl
  }, (mailErr) => {
    console.log('mailErr', mailErr);
    // return helper.resHandler(false, null, mailErr, res, 500);
    console.log(' noo mailErr');
    // return helper.resHandler(true, saveUser, null, res, 200);
  });
}

// DISABLE VEHICLE
exports.DisabledVehicleEmail = DisabledVehicleEmail = (subject,name,email,heading) => {

    app.mailer.send('emailTemplates/vehicles/vehicle-disabled', {
      to: email,
      subject: subject,
      name : name,
      heading:heading,
      baseUrl:config.baseUrl
    }, (mailErr) => {
      console.log('mailErr', mailErr);
      // return helper.resHandler(false, null, mailErr, res, 500);
      console.log(' noo mailErr');
      // return helper.resHandler(true, saveUser, null, res, 200);
    });
  }

/*****************************************************************/
/* ================ EMAIL TEMPLATES ERROR LOG ================== */
/*****************************************************************/

exports.logError = logError = (userId, moduleName, errorMsg) => {
  const dbColumns = `user_id, module,error_msg`;
  const queryParams = [userId, moduleName, errorMsg];
  const queryValues = '?, ?,?';
  db.insert('error_log', dbColumns, queryValues, queryParams)
    .then(resp => {
      //   return true;
    })
    .catch(error => {
      //return false;
    });
}
