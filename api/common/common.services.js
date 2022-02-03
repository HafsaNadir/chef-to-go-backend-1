/*
 ** Load Node Modules **
 */
const express = require("express");
const app = express();

app.use(require("sanitize").middleware);
const responseHandler = require("../../utility/responseHandler");
const imagesUpload = require("../../lib/imagesUpload");

const User = require('../models/User')

const validation = require("../../lib/validation");
const tableJson = require("../../config/table.json");
const striptags = require("striptags");
const config = require("../../config/environment");
const jwt = require("jsonwebtoken");
const md5 = require("md5");
const fs = require("fs");
const mailService = require('../../lib/mail.service')
/*
 * Get all
 */

exports.getAll = (resource, type, req) => {
  return new Promise(function (resolve, reject) {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };

    let table = tableJson[resource];
    console.log("table", table);
    if (table === undefined) {
      //return responseHandler.resHandler(false, {}, 'Invalid resouce '+resource, res, 500);
      reject("Invalid resource");
    }
    let requireFile = `../models/${resource}`;
    Model = require(requireFile);
    console.log(type);
    const object = type
      ? {
        isDeleted: false,
        [`${resource.toLowerCase()}Type`]: type,
      }
      : { isDeleted: false };
    Model.find(object)
      .skip((pageOptions.page - 1) * pageOptions.limit)
      .limit(pageOptions.limit)
      .then((resp) => {
        console.log(resp);
        if (!resp || !resp.length) {
          reject({ message: "No data found", code: 400 });
        }
        resolve(resp);
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );
  });
};

/*
 * Get single
 */

exports.getSingle = (resource, type, id) => {
  return new Promise(function (resolve, reject) {
    let table = tableJson[resource];
    if (table === undefined) {
      reject("Invalid resource");
    }
    id = typeof id == "undefined" ? "" : striptags(decodeURI(id.trim()));

    if (validation.isEmpty(id)) {
      reject({
        message: "id required",
        code: 400,
      });
    } else if (id.length > 24) {
      reject({
        message: "id should not be greater than 24 chars",
        code: 400,
      });
    }
    let requireFile = `../models/${resource}`;
    Model = require(requireFile);
    const object = type
      ? { _id: id, [`${resource.toLowerCase()}Type`]: type }
      : { _id: id };
    Model.findOne(object)
      .then((resp) => {
        if (!resp) {
          reject({ message: "Something Went Wrong", code: 400 });
        }
        resolve(resp);
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );
  });
};

/* edit */

exports.edit = (resource, type, data) => {
  return new Promise(function (resolve, reject) {
    let table = tableJson[resource];
    if (table === undefined) {
      reject("Invalid resource");
    }
    data.params.id =
      typeof data.params.id == "undefined"
        ? ""
        : striptags(decodeURI(data.params.id.trim()));

    if (validation.isEmpty(data.params.id)) {
      reject({
        message: "id required",
        code: 400,
      });
    } else if (data.params.id.length > 24) {
      reject({
        message: "id should not be greater than 24 chars",
        code: 400,
      });
    }
    let requireFile = `../models/${resource}`;
    const Model = require(requireFile);
    let validator = require(`../validation/${resource.toLowerCase()}Validate`);
    let model = new validator(data.body);
    let modelResp = model.validateSchema();
    //console.log(modelResp.error);
    console.log(data.params);
    if (modelResp.error) {
      reject({ message: modelResp.error.details[0].message, code: 400 });
    } else {
      const updates = Object.keys(data.body);
      var index = updates.indexOf("_id");
      if (index !== -1) updates.splice(index, 1);
      const object = type
        ? { _id: data.params.id, [`${resource.toLowerCase()}Type`]: type }
        : { _id: data.params.id };
      Model.findOne(object)
        .then((results) => {
          if (!results) {
            reject({ message: "Something Went Wrong", code: 400 });
          }
          updates.forEach(
            (update) => (results[update] = modelResp.value[update])
          );
          return results.save();
        })
        .then((resp) => {
          console.log(resp);
          resolve(resp);
        })
        .catch((error) => {
          console.log(error.name);
          if (error.name === "ValidationError") {
            reject({ message: error, code: 400 });
          } else {
            reject({
              message: `Internal Server Errorrrrr ${error}`,
              code: 500,
            });
          }
        });
    }
  });
};

/* delete */

exports.delete = (resource, type, id) => {
  return new Promise(function (resolve, reject) {
    let table = tableJson[resource];
    if (table === undefined) {
      reject("Invalid resource");
    }
    id = typeof id == "undefined" ? "" : striptags(decodeURI(id.trim()));

    if (validation.isEmpty(id)) {
      reject({
        message: "id required",
        code: 400,
      });
    } else if (id.length > 24) {
      reject({
        message: "id should not be greater than 24 chars",
        code: 400,
      });
    }
    let requireFile = `../models/${resource}`;
    Model = require(requireFile);
    const object = type
      ? { _id: id, [`${resource.toLowerCase()}Type`]: type }
      : { _id: id };
    Model.findOneAndUpdate(object, { isDeleted: true })
      .then((resp) => {
        if (!resp) {
          reject({ message: "Something Went Wrong", code: 400 });
        }
        resolve("Successfully Deleted");
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );
  });
};

/* status change */

exports.statusChange = (resource, type, id, data) => {
  return new Promise(function (resolve, reject) {
    let table = tableJson[resource];
    if (table === undefined) {
      reject("Invalid resource");
    }
    id = typeof id == "undefined" ? "" : striptags(decodeURI(id.trim()));

    if (validation.isEmpty(id)) {
      reject({
        message: "id required",
        code: 400,
      });
    } else if (id.length > 24) {
      reject({
        message: "id should not be greater than 24 chars",
        code: 400,
      });
    }
    let requireFile = `../models/${resource}`;
    Model = require(requireFile);
    const object = type
      ? { _id: id, [`${resource.toLowerCase()}Type`]: type }
      : { _id: id };
    console.log(data)
    Model.findOneAndUpdate(object, data, { new: true })
      .then((resp) => {
        if (!resp) {
          reject({ message: "Something Went Wrong", code: 400 });
        }
        resolve(resp.status);
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );
  });
};

/* login */

exports.login = (resource, type, sessionName, req) => {
  return new Promise(function (resolve, reject) {
    let table = tableJson[resource];
    if (table === undefined) {
      reject("Invalid resource");
    }
    let requireFile = `../models/${resource}`;
    const Model = require(requireFile);
    const object = type
      ? {
        email: req.body.email,
        [`${resource.toLowerCase()}Type`]: type,
      } :
      { email: req.body.email }

    console.log(req.body)
    Model.findOne(object)
      .then((user) => {
        console.log(user)
        if (!user) {
          reject({
            message: "The email address or password you entered is incorrect.",
            code: 400,
          });
        } else if (user) {
          if (!user.validPassword(req.body.password)) {
            reject({
              message:
                "The email address or password you entered is incorrect.",
              code: 400,
            });
          }
          else if (!user.isEmailVerified) {
            reject({
              message: 'You must confirm your email address to continue.',
              code: 400
            });
          }
          else if (user.status === "blocked") {
            reject({
              message:
                'Your account has been disabled. If you have any questions or concerns, you can visit our <a href="">help centre</a>.',
              code: 400,
            });
          } else if (user.isDeleted) {
            reject({
              message:
                "The email address or password you entered is incorrect.",
              code: 400,
            });
          } else {
            let userObj = {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              id: user._id,
              userType: user.userType,
              profilePicture : user.profilePicture
            };
            /* Set session */
            req.session[sessionName] = userObj;
            const token = jwt.sign(userObj, config.secrets.key, {
              expiresIn: 6400, // expires in 24 hours
            });
            const data = { token, user: userObj };
            let date = new Date();
            Model.findOneAndUpdate(
              { _id: user._id },
              {
                $set: {
                  lastLogin: date,
                },
              },
              { new: true }
            )
              .then((userData) => resolve(data))
              .catch((error) =>
                reject({
                  message: `Internal Server Error ${error}`,
                  code: 500,
                })
              );
          }
        }
      })
      .catch((error) => {
        if (error.name === "ValidationError") {
          reject({ message: error.message, code: 400 });
        } else {
          reject({ message: `Internal Server Error ${error}`, code: 500 });
        }
      });
  });
};

// /* forgot Password */

// exports.forgotPassword = (resource, type, data) => {
//   return new Promise(function (resolve, reject) {
//     let table = tableJson[resource];
//     if (table === undefined) {
//       reject("Invalid resource");
//     }
//     if (validation.isEmpty(data.email)) {
//       return responseHandler.resHandler(false, {}, 'Enter your email address.', res, 400);
//     }
//     else if (validation.validateEmail(data.email) === false) {
//       return responseHandler.resHandler(false, {}, 'Enter a valid email address.', res, 400);
//     }
//     let requireFile = `../models/${resource}`;
//     const Model = require(requireFile);
//       const object = type
//         ? { email: req.body.email }
//         : {
//           email: req.body.email,
//           [`${resource.toLowerCase()}Type`]: type,
//         };
//       object
//         .then((user) => {
//           if (!user) {
//             reject({ message: "Something Went Wrong", code: 400 });
//           } else if (user) {
//             let dt = new Date();
//             let timestamp = dt.getTime();
//             const passwordHash = md5(user.password + timestamp);
//             console.log(
//               "db expiry " + user.passwordHashDate + " curreent date " + dt
//             );
//             let attempt = user.passwordHashAttempt + 1;
//             if (user.passwordHashAttempt == 2 && user.passwordHashDate > dt) {
//               reject({
//                 message:
//                   "You can request another reset password email after 30 minutes.",
//                 code: 400,
//               });
//             } else if (user.passwordHashAttempt == 2) {
//               attempt = 1;
//             }
//             dt.setMinutes(dt.getMinutes() + 30);
//             Model.findOneAndUpdate(
//               { _id: user._id },
//               {
//                 $set: {
//                   passwordHash: passwordHash,
//                   passwordHashDate: dt,
//                   passwordHashAttempt: attempt,
//                 },
//               },
//               { new: true }
//             )
//               .then((userData) => {
//                 let link =
//                   config.clientUrl +
//                   "password/reset/" +
//                   passwordHash +
//                   "/" +
//                   user._id;
//                 mailService.forgotPassword(user.email, user.firstName, link);
//                 resolve(link);
//               })
//               .catch((err) => {
//                 reject({ message: `Internal Server Error ${err}`, code: 500 });
//               });
//           }
//         })
//         .catch((error) => {
//           if (error.name === "ValidationError") {
//             reject({ message: error.message, code: 400 });
//           } else {
//             reject({ message: `Internal Server Error ${error}`, code: 500 });
//           }
//         });
//   });
// };

// /* reset Password */

// exports.resetPassword = (resource, type, data) => {
//   return new Promise(function (resolve, reject) {
//     let table = tableJson[resource];
//     if (table === undefined) {
//       reject("Invalid resource");
//     }
//     if (validation.isEmpty(data.password)) {
//       return responseHandler.resHandler(false, {}, 'Please choose a new password.', res, 400);
//     }
//     let hash = req.params.hash;
//     let refId = req.params.id;
//     let requireFile = `../models/${resource}`;
//     const Model = require(requireFile);
//       let object = type
//         ? {
//           _id: refId,
//           [`${resource.toLowerCase()}Type`]: type,
//         }
//         : { _id: refId };
//       Model.findOne(object)
//         .then((user) => {
//           if (!user) {
//             reject({ message: "Something Went Wrong", code: 400 });
//           } else if (user) {
//             Model.findById({ _id: user._id })
//               .then((userData) => {
//                 userData.password = data.password;
//                 userData.passwordHashAttempt = 0;
//                 userData.passwordHash = "";
//                 userData.save();
//                 resolve({});
//               })
//               .catch((err) => {
//                 reject({ message: `Internal Server Error ${err}`, code: 500 });
//               });
//           }
//         })
//         .catch((error) => {
//           if (error.name === "ValidationError") {
//             reject({ message: error.message, code: 400 });
//           } else {
//             reject({ message: `Internal Server Error ${error}`, code: 500 });
//           }
//         });
//   });
// };

exports.imageUpload = (resource, req, sessionName, imageName) => {
  return new Promise(function (resolve, reject) {
    let table = tableJson[resource];
    if (table === undefined) {
      reject("Invalid resource");
    }
    let requireFile = `../models/${resource}`;
    const Model = require(requireFile);
    console.log(req.file);
    imagesUpload.uploadImage(req, res, function (err) {
      if (err) {
        console.log("img err ", err);
        reject({ message: "Unknown file format.", code: 400 });
      }
      if (req.fileValidationError) {
        //fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
        reject({ message: "Unknown file format.", code: 400 });
      }
      if (typeof req.file == "undefined") {
        // fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
        reject({ message: "Something Went Wrong", code: 400 });
      }
      if (req.file.size > 15728640) {
        fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
        reject({
          message:
            "The file size is too large. Please upload a photo of maximum up to 15MB.",
          code: 400,
        });
      }
      Model.findOneAndUpdate(
        { _id: req.session[sessionName].id },
        {
          $set: {
            [imageName]: req.file.filename,
          },
        },
        { new: true }
      )
        .then((userData) => {
          req.session[sessionName][imageName] = req.file.filename;
          resolve({ [imageName]: req.file.filename });
        })
        .catch((err) => {
          reject({ message: "Something Went Wrong", code: 400 });
        });
    });
  });
};

exports.getProfile = (id) => {
  return new Promise(function (resolve, reject) {
    User.findOne({ _id: id })
      .then((resp) => {
        if (!resp) {
          reject({ message: "Something Went Wrong", code: 400 });
        }
        console.log(resp)
        resolve(resp);
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );
  })
}

exports.editProfile = (req, res) => {
  return new Promise(function (resolve, reject) {
    let image;
    imagesUpload.uploadImage(req, res, function (err) {
      if (err) {
        console.log("req.file", req.file);
        console.log("img err ", err);
        reject({ message: "bad request", code: 400 });
      }
      if (req.file == null || req.file == undefined) {
        // reject({ message: "file null", code: 400 });
        profilePicture = req.body.profilePicture;
      } else {
        if (req.fileValidationError) {
          reject({ message: "bad request", code: 400 });
        }
        if (typeof req.file == "undefined") {
          reject({ message: "bad request", code: 400 });
        }
        if (req.file.size > 15728640) {
          fs.unlinkSync(
            `${config.imageConfiguration.path}/${req.file.filename}`
          );
          reject({ message: "bad request", code: 400 });
        }
        profilePicture = req.file.filename;
      }
      let reqObject = {
        profilePicture: profilePicture,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber
      };
      console.log("reqObject", reqObject);

      User.findOneAndUpdate({ _id: req.user.id }, reqObject, { new: true })
        .then((resp) => {
          if (!resp) {
            reject({ message: "No data found", code: 400 });
          }
          resolve(resp);
        })
        .catch((error) => {
          if (error.name === "ValidationError") {
            reject({ message: error.message, code: 400 });
          } else {
            reject({ message: `Internal Server Error ${error}`, code: 500 });
          }
        }
        );
    });
  });
};

exports.changeProfilePassword = (req) => {
  return new Promise(function (resolve, reject) {
    User.findOne({ _id: req.user.id })
      .then((user) => {

        if (!user) {
          reject({ message: "Something Went Wrong", code: 400 });
        }
        else if (user) {
          if (!user.validPassword(req.body.currentPass)) {
            reject({
              message:
                "Current Password is not correct",
              code: 400,
            });
          }
        }
        user.password = req.body.newPass
        return user.save()
      })
      .then(resp => resolve(resp))
      .catch((error) => {
        reject({ message: `Internal Server Error ${error}`, code: 500 });
      }
      );
  });
};



/*
** Function Name : socialLogin
** Method  : POST
** Description : this method use for socialLogin .
** Params : registration fields :D
*/
// SOCIAL LOGIN
exports.socialLogin = (req, type) => {
  return new Promise((resolve, reject) => {
    console.log(req.body)
    if (validation.isEmpty(req.body.firstName)) {
      reject({ message: 'Enter your first name.', code: 400 });
    }
    else if (validation.isEmpty(req.body.lastName)) {
      reject({ message: 'Enter your last name.', code: 400 });
    }
    else if (validation.isEmpty(req.body.email)) {
      reject({ message: 'Enter your email address.', code: 400 });
    }
    else if (validation.validateEmail(req.body.email) === false) {
      reject({ message: 'Enter a valid email address.', code: 400 });
    }
    else if (validation.isEmpty(req.body.id)) {
      reject({ message: 'Enter your social ID.', code: 400 });
    }
    const dataObject = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      // isEmailVerified: true,
      isSocialLogin: true,
      socialDetails: {
        socialId: req.body.id,
      },
      userType: type
    };
    const obj = { email: dataObject.email, userType: dataObject.userType, isSocialLogin: true, 'socialDetails.socialId': req.body.id }
    User.find(obj)
      .then(user => {
        console.log(user)
        if (user.length == 0) {
          User.create(dataObject)
            .then(result => {
              let fs = require('fs'),
                request = require('request');
              let download = function (uri, filename, callback) {
                request.head(uri, function (err, res, body) {
                  request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
                });
              };
              download('https://graph.facebook.com/' + req.body.id + '/picture?type=normal', './public/uploads/' + result._id + '.png', function () {
                User.findOneAndUpdate({ _id: result._id },
                  {
                    $set: {
                      'profilePicture': result._id + '.png',
                    }
                  },
                  { new: true })
                  .then(userData => {
                    let userObj = {
                      firstName: result.firstName,
                      lastName: result.lastName,
                      email: result.email,
                      id: result._id,
                      userType: result.userType,
                      profilePicture : result._id + '.png'
                    };
                    /* Set session */
                    const token = jwt.sign(userObj, config.secrets.key, {
                      expiresIn: 6400, // expires in 24 hours
                    });
                    const data = { token, user: userObj };
                    resolve({ message: 'Your email address has been successfully confirmed.', data });
                  }).catch(err => {
                    reject({ message: 'Something Went Wrong', code: 500 });
                  });
              });
            })
            .catch(error => reject({ message: `error : ${error}`, code: 500 }));
        }
        else {
          if (user[0].isDeleted) {
            reject({ message: 'The email address or password you entered is incorrect.', code: 400 });
          }
          let userObj = {
            firstName: user[0].firstName,
            lastName: user[0].lastName,
            email: user[0].email,
            id: user[0]._id,
            userType: user[0].userType,
            profilePicture: user[0].profilePicture

          };
          const token = jwt.sign(userObj, config.secrets.key, {
            expiresIn: 6400, // expires in 24 hours
          });
          const data = { token, user: userObj };
          resolve(data)
        }
      })
      .catch((error) => {
        if (error.name === "ValidationError") {
          reject({ message: error.message, code: 400 });
        } else {
          reject({ message: `Internal Server Error ${error}`, code: 500 });
        }
      });
  })
};


/* forgot Password */

exports.forgotPassword = (data) => {
  return new Promise(function (resolve, reject) {
    if (validation.isEmpty(data.email)) {
      return responseHandler.resHandler(false, {}, 'Enter your email address.', res, 400);
    }
    else if (validation.validateEmail(data.email) === false) {
      return responseHandler.resHandler(false, {}, 'Enter a valid email address.', res, 400);
    }
    User.findOne({ email: data.email })
      .then((user) => {
        if (!user) {
          reject({ message: "Something Went Wrong", code: 400 });
        } else if (user) {
          let dt = new Date();
          let timestamp = dt.getTime();
          const passwordHash = md5(user.password + timestamp);
          console.log(
            "db expiry " + user.passwordHashDate + " curreent date " + dt
          );
          let attempt = user.passwordHashAttempt + 1;
          if (user.passwordHashAttempt == 2 && user.passwordHashDate > dt) {
            reject({
              message:
                "You can request another reset password email after 30 minutes.",
              code: 400,
            });
          } else if (user.passwordHashAttempt == 2) {
            attempt = 1;
          }
          dt.setMinutes(dt.getMinutes() + 30);
          User.findOneAndUpdate(
            { _id: user._id },
            {
              $set: {
                passwordHash: passwordHash,
                passwordHashDate: dt,
                passwordHashAttempt: attempt,
              },
            },
            { new: true }
          )
            .then((userData) => {
              let link =
                config.clientUrl +
                "password/reset/" +
                passwordHash +
                "/" +
                user._id;
              mailService.forgotPassword(user.email, user.firstName, link);
              resolve({});
            })
            .catch((err) => {
              reject({ message: `Internal Server Error ${err}`, code: 500 });
            });
        }
      })
      .catch((error) => {
        if (error.name === "ValidationError") {
          reject({ message: error.message, code: 400 });
        } else {
          reject({ message: `Internal Server Error ${error}`, code: 500 });
        }
      });
  });
};

/* reset Password */

exports.resetPassword = (req) => {
  return new Promise(function (resolve, reject) {
    if (validation.isEmpty(req.body.password)) {
      return responseHandler.resHandler(false, {}, 'Please choose a new password.', res, 400);
    }
    let hash = req.params.hash;
    let refId = req.params.id;
    console.log(refId, hash)
    User.findOne({ _id: refId, passwordHash: hash })
      .then((user) => {
        if (!user) {
          reject({ message: "Something Went Wrong", code: 400 });
        } else if (user) {
          User.findById({ _id: user._id })
            .then((userData) => {
              userData.password = req.body.password;
              userData.passwordHashAttempt = 0;
              userData.passwordHash = "";
              userData.save();
              resolve({});
            })
            .catch((err) => {
              reject({ message: `Internal Server Error ${err}`, code: 500 });
            });
        }
      })
      .catch((error) => {
        if (error.name === "ValidationError") {
          reject({ message: error.message, code: 400 });
        } else {
          reject({ message: `Internal Server Error ${error}`, code: 500 });
        }
      });
  });
};