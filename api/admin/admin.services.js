/*
 ** Load Node Modules **
 */
const express = require("express");
const app = express();

app.use(require("sanitize").middleware);
const responseHandler = require("../../utility/responseHandler");

const validation = require("../../lib/validation");

const striptags = require("striptags");

const tableJson = require("../../config/table.json");
const Admin = require("../models/Admin");
const Menu = require("../models/Menu");
const Order = require("../models/Order");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Package = require("../models/Package");
const Category = require("../models/Category");

const adminValidate = require("../validation/adminValidate");
const imagesUpload = require("../../lib/imagesUpload");
const jwt = require("jsonwebtoken");
const config = require("../../config/environment");

exports.seed = () => {
  return new Promise(function (resolve, reject) {
    const dataObject = {
      firstName: "Bilal",
      lastName: "Khan",
      email: "a@a.com",
      password: "testtest",
      phoneNumber: "+447580004803",
      adminType: "Superuser",
      profilePicture: "profile.png",
      addresses: [
        {
          address: "abc",
        },
      ],
      status: "active",
      permissions: {
        dashboard: true,
        customers: true,
        subadmins: true,
        vendors: true,
        restaurants: true,
        menus: true,
        orders: true,
        categories: true,
        subscriptions: true,
        reporting: true,
        settings: true,
      },
    };
    const admin = new Admin(dataObject);
    admin
      .save()
      .then((result) => resolve(result))
      .catch((error) => reject({ message: `Error ${error}`, code: 500 }));
  });
};

exports.createSubAdmin = (req, res) => {
  return new Promise(function (resolve, reject) {
    imagesUpload.uploadImage(req, res, function (err) {
      if (req.file) {
        if (err) {
          console.log("img err ", err);
          // return responseHandler.resHandler(false, null, 'Unknown file format.', res, 400);
          reject({ message: "bad request", code: 400 });
        }
        if (req.fileValidationError) {
          //fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
          // return responseHandler.resHandler(false, null, 'Unknown file format.', res, 400);
          reject({ message: "bad request", code: 400 });
        }
        if (typeof req.file == "undefined") {
          // fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
          //return responseHandler.resHandler(false, null, 'No data found', res, 400);

          reject({ message: "bad request", code: 400 });
        }

        if (req.file.size > 15728640) {
          fs.unlinkSync(
            `${config.imageConfiguration.path}/${req.file.filename}`
          );
          //  return responseHandler.resHandler(false, null, 'The file size is too large. Please upload a photo of maximum up to 15MB.', res, 400);
          reject({ message: "bad request", code: 400 });
        }
      }
      if (validation.isEmpty(req.body.firstName)) {
        reject({ message: "Please enter your first name", code: 400 });
      } else if (validation.isEmpty(req.body.lastName)) {
        reject({ message: "Please enter your last name", code: 400 });
      } else if (validation.isEmpty(req.body.phoneNumber)) {
        reject({ message: "Please enter your mobile number", code: 400 });
      } else if (validation.isEmpty(req.body.email)) {
        reject({ message: "Enter your email address.", code: 400 });
      } else if (validation.validateEmail(req.body.email) === false) {
        reject({ message: "Enter a valid email address.", code: 400 });
      } else if (validation.isEmpty(req.body.password)) {
        reject({ message: "Please choose a password.", code: 400 });
      } else if (Object.keys(req.body.permissions).length === 0) {
        reject({ message: "Please grant at least one permission.", code: 400 });
      }
      permissions = JSON.parse(req.body.permissions);
      console.log(permissions);
      let reqObject = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        adminType: "subadmin",
        permissions,
      };
      if (req.file) {
        reqObject.profilePicture = req.file.filename;
      }
      Admin.create(reqObject)
        .then((resp) => resolve(resp))
        .catch((error) => {
          if (error.name === "ValidationError") {
            reject({ message: error.message, code: 400 });
          } else {
            reject({ message: `Internal Server Error ${error}`, code: 500 });
          }
        });
    });
  });
};

exports.adminFindById = (data) => {
  return new Promise(function (resolve, reject) {
    let obj = { _id: data.id };
    Admin.findOne(obj)
      .then((admin) => {
        if (!admin) {
          reject("invalid token");
        } else {
          resolve(admin);
        }
      })
      .catch((error) => {
        reject({ message: `Internal Server Error ${error}`, code: 500 });
      });
  });
};

/*
 * Get all
 */

exports.getAll = (resource, type, req) => {
  return new Promise(function (resolve, reject) {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    };
    console.log(pageOptions);

    let table = tableJson[resource];
    console.log("table", table);
    if (table === undefined) {
      //return responseHandler.resHandler(false, {}, 'Invalid resouce '+resource, res, 500);
      reject("Invalid resource");
    }
    let requireFile = `../models/${resource}`;
    console.log(requireFile);
    Model = require(requireFile);
    console.log(type);
    const object = type
      ? {
        isDeleted: false,
        [`${resource.toLowerCase()}Type`]: type,
      }
      : { isDeleted: false };
    console.log(Model, object);
    Model.find(object)
      .skip((pageOptions.page - 1) * pageOptions.limit)
      .limit(pageOptions.limit)
      .then((resp) => {
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

exports.getAllOrder = (req) => {
  return new Promise(function (resolve, reject) {
    Order.find({ isDeleted: false })
      .populate("restaurantId")
      .populate("customerId")
      .populate("orderDetails.id")
      .then((resp) => resolve(resp))
      .catch((error) => {
        if (error.name === "ValidationError") {
          reject({ message: error.message, code: 400 });
        } else {
          reject({ message: `Internal Server Error ${error}`, code: 500 });
        }
      });
  });
};

// exports.getAllOrder = (req) => {
//   return new Promise(function (resolve, reject) {
//     const pageOptions = {
//       page: parseInt(req.query.page, 10) || 1,
//       limit: parseInt(req.query.limit, 10) || 20,
//     };
//     Order.aggregate(
//       [
//         {
//           $lookup: {
//             from: "users",
//             localField: "customerId",
//             foreignField: "_id",
//             as: "customer_info",
//           },
//         },
//         {
//           $match: {
//             isDeleted: false,
//           },
//         },
//         {
//           $project: {
//             "customer_info.password": 0,
//           },
//         },
//         {
//           $limit: pageOptions.limit,
//         },
//         {
//           $skip: (pageOptions.page - 1) * pageOptions.limit,
//         },
//       ],
//       function (error, resp) {
//         if (!resp || !resp.length) {
//           reject({ message: "No data found", code: 400 });
//         } else if (error) {
//           reject({ message: `Internal Server Error ${error}`, code: 500 });
//         }
//         resolve(resp);
//       }
//     );
//   });
// };

exports.getCustomerAllOrders = (req) => {
  return new Promise(function (resolve, reject) {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    };
    User.findOne({ _id: req.params.id, isDeleted: false })
      .then((result) => {
        if (!result) {
          reject({ message: "No data found", code: 400 });
        }
        Order.find({ customerId: req.params.id, isDeleted: false })
          .populate("restaurantId", "name")
          .then((data) => {
            if (!data) {
              resolve({ customer: result });
            }
            resolve({ customer: result, orders: data });
          })
          .catch((err) =>
            reject({ message: `Internal Server Error ${err}`, code: 500 })
          );
      })
      .catch((error) =>
      reject({ message: `Internal Server Error ${error}`, code: 500 })
    );
  });

  // User.findOne({ _id: req.params.id, isDeleted: false })
  //   .then((result) => {
  //     if (!result) {
  //       reject({ message: "No data found", code: 400 });
  //     }
  //     result
  //       .populate({
  //         path: "orders",
  //         options: {
  //           limit: pageOptions.limit,
  //           skip: (pageOptions.page - 1) * pageOptions.limit,
  //         },
  //         match: { isDeleted: false },
  //       })

  //       .execPopulate()
  //       .then((data) => {
  //         if (!data.orders.length) {
  //           resolve({ customer: result });
  //         }
  //         resolve({ customer: data, orders: data.orders });
  //       })
  //       .catch((err) =>
  //         reject({ message: `Internal Server Error ${err}`, code: 500 })
  //       );
  //   })
  //   .catch((error) =>
  //     reject({ message: `Internal Server Error ${error}`, code: 500 })
  //   );
// });
};

exports.getRestaurantOrders = (req) => {
  return new Promise(function (resolve, reject) {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    };
    
    Restaurant.findOne({ _id: req.params.id, isDeleted: false })
      .then((result) => {
        if (!result) {
          reject({ message: "No data found", code: 400 });
        }
        Order.find({ restaurantId: req.params.id, isDeleted: false })
          .populate("customerId", ["firstName", "lastName"])
          .then((data) => {
            if (!data) {
              resolve({ restaurant: result });
            }
            resolve({ restaurant: result, orders: data });
          })
          .catch((err) =>
            reject({ message: `Internal Server Error ${err}`, code: 500 })
          );
      })
      .catch((error) =>
      reject({ message: `Internal Server Error ${error}`, code: 500 })
    );
  });
  //   Restaurant.findOne({ _id: req.params.id, isDeleted: false })
  //     .then((result) => {
  //       if (!result) {
  //         reject({ message: "No data found", code: 400 });
  //       }
  //       result
  //         .populate({
  //           path: "orders",
  //           options: {
  //             limit: pageOptions.limit,
  //             skip: (pageOptions.page - 1) * pageOptions.limit,
  //           },
  //           match: { isDeleted: false },
  //         })
  //         .execPopulate()
  //         .then((data) => {
  //           if (!data.orders.length) {
  //             resolve({ restaurant: data });
  //           }
  //           resolve({ restaurant: data, orders: data.orders });
  //         })
  //         .catch((err) =>
  //           reject({ message: `Internal Server Error ${err}`, code: 500 })
  //         );
  //     })
  //     .catch((error) =>
  //       reject({ message: `Internal Server Error ${error}`, code: 500 })
  //     );
  // });
};

exports.deliveryStatusChangeRestaurant = (id, data) => {
  return new Promise(function (resolve, reject) {
    Restaurant.findOneAndUpdate({ _id: id }, data, { new: true })
      .then((resp) => {
        if (!resp) {
          reject({ message: "No data found", code: 400 });
        }
        resolve(resp.status);
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );
  });
};

exports.getAllMenu = (req) => {
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 1,
    limit: parseInt(req.query.limit, 10) || 20,
  };
  return new Promise(function (resolve, reject) {
    Menu.find({ isDeleted: false })
      .populate("categoryId", "name")
      .populate("restaurantId", "name")
      .skip((pageOptions.page - 1) * pageOptions.limit)
      .limit(pageOptions.limit)
      .then((menu) => {
        if (!menu || !menu.length) {
          reject({ message: "No data found", code: 400 });
        }
        resolve(menu);
      })
      .catch((error) => {
        reject({ message: `Internal Server Error ${error}`, code: 500 });
      });
  });
};

exports.getRestaurantMenu = (req) => {
  return new Promise(function (resolve, reject) {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 20,
    };
    Menu.find({ restaurantId: req.params.id, isDeleted: false })
      .populate("categoryId", "name")
      .then((menu) => {
        if (!menu || !menu.length) {
          reject({ message: "No data found", code: 400 });
        }
        resolve(menu);
      })
      .catch((error) => {
        console.log(error);
        reject({ message: `Internal Server Error ${error}`, code: 500 });
      });
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
          reject({ message: "No data found", code: 400 });
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
    console.log(resource, type, id, data);
    let table = tableJson[resource];
    if (table === undefined) {
      reject("Invalid resource");
    }
    id = typeof id == "undefined" ? "" : striptags(decodeURI(id.trim()));
    console.log("tune");
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
    console.log(requireFile);
    Model = require(requireFile);
    const object = type
      ? { _id: id, [`${resource.toLowerCase()}Type`]: type }
      : { _id: id };
    console.log(data);
    console.log("abnnnc");
    const updateObj = { status: data.status };
    Model.findOneAndUpdate(object, updateObj, { new: true })
      .then((resp) => {
        if (!resp) {
          reject({ message: "No data found", code: 400 });
        }
        resolve(resp.status);
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );
  });
};

exports.createCategory = (req, res) => {
  return new Promise(function (resolve, reject) {
    imagesUpload.uploadImage(req, res, function (err) {
      if (err) {
        console.log("img err ", err);
        // return responseHandler.resHandler(false, null, 'Unknown file format.', res, 400);
        reject({ message: "bad request", code: 400 });
      }
      if (req.fileValidationError) {
        //fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
        // return responseHandler.resHandler(false, null, 'Unknown file format.', res, 400);
        reject({ message: "bad request", code: 400 });
      }
      if (typeof req.file == "undefined") {
        // fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
        //return responseHandler.resHandler(false, null, 'No data found', res, 400);
        reject({ message: "bad request", code: 400 });
      }
      if (req.file.size > 15728640) {
        fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
        //  return responseHandler.resHandler(false, null, 'The file size is too large. Please upload a photo of maximum up to 15MB.', res, 400);
        reject({ message: "bad request", code: 400 });
      }
      if (validation.isEmpty(req.body.name)) {
        reject({ message: "Please enter category name", code: 400 });
      } else if (validation.isEmpty(req.body.shortDesc)) {
        reject({ message: "Please give short description", code: 400 });
      }
      let reqObject = {
        image: req.file.filename,
        name: req.body.name,
        shortDesc: req.body.shortDesc,
      };
      Category.create(reqObject)
        .then((resp) => resolve(resp))
        .catch((error) => {
          if (error.name === "ValidationError") {
            reject({ message: error.message, code: 400 });
          } else {
            reject({ message: `Internal Server Error ${error}`, code: 500 });
          }
        });
    });
  });
};

exports.createPackage = (req, res) => {
  return new Promise(function (resolve, reject) {
    if (validation.isEmpty(req.body.name)) {
      reject({ message: "Please enter subscription name", code: 400 });
    } else if (validation.isEmpty(req.body.shortDesc)) {
      reject({ message: "Please give short desc", code: 400 });
    } else if (validation.isEmpty(req.body.packageType)) {
      reject({ message: "Please select subscription type", code: 400 });
    }
    let reqObject = {
      name: req.body.name,
      shortDesc: req.body.shortDesc,
      packageType: req.body.packageType,
    };
    Package.create(reqObject)
      .then((resp) => resolve(resp))
      .catch((error) => {
        if (error.name === "ValidationError") {
          reject({ message: error.message, code: 400 });
        } else {
          reject({ message: `Internal Server Error ${error}`, code: 500 });
        }
      });
  });
};

exports.editMenu = (req, res) => {
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
        image = req.body.image;
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
        image = req.file.filename;
      }
      if (validation.isEmpty(req.body.name)) {
        reject({ message: "Please enter restaurant name", code: 400 });
      } else if (validation.isEmpty(req.body.shortDesc)) {
        reject({ message: "Please give short description", code: 400 });
      } else if (validation.isEmpty(req.body.price)) {
        reject({ message: "Please enter price", code: 400 });
      } else if (validation.isEmpty(req.body.categoryId)) {
        reject({ message: "Category required", code: 400 });
      }
      let reqObject = {
        image: image,
        name: req.body.name,
        shortDesc: req.body.shortDesc,
        categoryId: req.body.categoryId,
        price: req.body.price,
      };
      console.log("reqObject", reqObject);

      Menu.findOneAndUpdate({ _id: req.params.id }, reqObject, { new: true })
        .then((resp) => {
          if (!resp) {
            reject({ message: "No data found", code: 400 });
          }
          resolve(resp);
        })
        .catch((error) =>
          reject({ message: `Internal Server Error ${error}`, code: 500 })
        );
    });
  });
};

exports.editCategory = (req, res) => {
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
        image = req.body.image;
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
        image = req.file.filename;
      }
      if (validation.isEmpty(req.body.name)) {
        reject({ message: "Please enter category name", code: 400 });
      } else if (validation.isEmpty(req.body.shortDesc)) {
        reject({ message: "Please give short description", code: 400 });
      }
      let reqObject = {
        image: image,
        name: req.body.name,
        shortDesc: req.body.shortDesc,
      };
      console.log("reqObject", reqObject);

      Category.findOneAndUpdate({ _id: req.params.id }, reqObject, {
        new: true,
      })
        .then((resp) => {
          if (!resp) {
            reject({ message: "No data found", code: 400 });
          }
          resolve(resp);
        })
        .catch((error) =>
          reject({ message: `Internal Server Error ${error}`, code: 500 })
        );
    });
  });
};

exports.editRestaurant = (req, res) => {
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
        image = req.body.image;
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
        image = req.file.filename;
      }

      if (validation.isEmpty(req.body.name)) {
        reject({ message: "Please enter restaurant name", code: 400 });
      } else if (validation.isEmpty(req.body.tagline)) {
        reject({ message: "Please enter restaurant tagline", code: 400 });
      } else if (validation.isEmpty(req.body.shortDesc)) {
        reject({ message: "Please give short description", code: 400 });
      }
      let reqObject = {
        image: image,
        name: req.body.name,
        tagline: req.body.tagline,
        shortDesc: req.body.shortDesc,
      };
      console.log("reqObject", reqObject);

      Restaurant.findOneAndUpdate({ _id: req.params.id }, reqObject, {
        new: true,
      })
        .then((resp) => {
          if (!resp) {
            reject({ message: "No data found", code: 400 });
          }
          resolve(resp);
        })
        .catch((error) =>
          reject({ message: `Internal Server Error ${error}`, code: 500 })
        );
    });
  });
};

exports.editCustomer = (req, res) => {
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

      if (validation.isEmpty(req.body.firstName)) {
        reject({ message: "Please enter your first name", code: 400 });
      } else if (validation.isEmpty(req.body.lastName)) {
        reject({ message: "Please enter your last name", code: 400 });
      } else if (validation.isEmpty(req.body.phoneNumber)) {
        reject({ message: "Please enter your mobile number", code: 400 });
      }
      let reqObject = {
        profilePicture: profilePicture,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
      };
      console.log("reqObject", reqObject);

      User.findOneAndUpdate(
        { _id: req.params.id, userType: "customer" },
        reqObject,
        { new: true }
      )
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
        });
    });
  });
};

exports.editVendor = (req, res) => {
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

      if (validation.isEmpty(req.body.firstName)) {
        reject({ message: "Please enter your first name", code: 400 });
      } else if (validation.isEmpty(req.body.lastName)) {
        reject({ message: "Please enter your last name", code: 400 });
      } else if (validation.isEmpty(req.body.phoneNumber)) {
        reject({ message: "Please enter your mobile number", code: 400 });
      } else if (validation.isEmpty(req.body.businessName)) {
        reject({ message: "Please enter your business name", code: 400 });
      }
      let reqObject = {
        profilePicture: profilePicture,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        businessName: req.body.businessName,
      };
      console.log("reqObject", reqObject);

      User.findOneAndUpdate(
        { _id: req.params.id, userType: "restaurant_owner" },
        reqObject,
        { new: true }
      )
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
        });
    });
  });
};

exports.editSubadmin = (req, res) => {
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
      if (validation.isEmpty(req.body.firstName)) {
        reject({ message: "Please enter your first name", code: 400 });
      } else if (validation.isEmpty(req.body.lastName)) {
        reject({ message: "Please enter your last name", code: 400 });
      } else if (validation.isEmpty(req.body.phoneNumber)) {
        reject({ message: "Please enter your mobile number", code: 400 });
      } else if (
        Object.keys(req.body.permissions).every(
          (value) => req.body.permissions[value] === false
        )
      ) {
        reject({ message: "Please grant at least one permission.", code: 400 });
      }
      let reqObject = {
        profilePicture: profilePicture,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        permissions: JSON.parse(req.body.permissions),
      };
      console.log("reqObject", reqObject);

      Admin.findOneAndUpdate(
        { _id: req.params.id, adminType: "subadmin" },
        reqObject,
        { new: true }
      )
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
        });
    });
  });
};

exports.editPackage = (req, res) => {
  return new Promise(function (resolve, reject) {
    if (validation.isEmpty(req.body.name)) {
      reject({ message: "Please enter subscription name", code: 400 });
    } else if (validation.isEmpty(req.body.shortDesc)) {
      reject({ message: "Please give short desc", code: 400 });
    } else if (validation.isEmpty(req.body.packageType)) {
      reject({ message: "Please select subscription type", code: 400 });
    }
    let reqObject = {
      name: req.body.name,
      shortDesc: req.body.shortDesc,
      packageType: req.body.packageType,
    };
    console.log("reqObject", reqObject);

    Package.findOneAndUpdate({ _id: req.params.id }, reqObject, { new: true })
      .then((resp) => {
        if (!resp) {
          reject({ message: "No data found", code: 400 });
        }
        resolve(resp);
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );
  });
};

exports.getSuperuser = (id) => {
  return new Promise(function (resolve, reject) {
    Admin.findOne({ _id: id })
      .then((resp) => {
        if (!resp) {
          reject({ message: "Something Went Wrong", code: 400 });
        }
        console.log(resp);
        resolve(resp);
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );
  });
};
exports.getSubadminPermissions = (id) => {
  return new Promise(function (resolve, reject) {
    Admin.findOne({ _id: id })
      .then((resp) => {
        if (!resp) {
          reject({ message: "Something Went Wrong", code: 400 });
        }
        resolve(resp.permissions);
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );
  });
};
exports.editSuperuser = (req, res) => {
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
      if (validation.isEmpty(req.body.firstName)) {
        reject({ message: "Please enter your first name", code: 400 });
      } else if (validation.isEmpty(req.body.lastName)) {
        reject({ message: "Please enter your last name", code: 400 });
      } else if (validation.isEmpty(req.body.phoneNumber)) {
        reject({ message: "Please enter your mobile number", code: 400 });
      }
      let reqObject = {
        profilePicture: profilePicture,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
      };
      console.log("reqObject", reqObject);

      Admin.findOneAndUpdate(
        { _id: req.user.id, adminType: "Superuser" },
        reqObject,
        { new: true }
      )
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
        });
    });
  });
};

exports.changePasswordSuperuser = (req) => {
  return new Promise(function (resolve, reject) {
    if (validation.isEmpty(req.body.currentPass)) {
      reject({ message: "Enter your current password", code: 400 });
    }
    if (validation.isEmpty(req.body.newPass)) {
      reject({ message: "Enter your current password", code: 400 });
    }
    Admin.findOne({ _id: req.user.id, adminType: "Superuser" })
      .then((user) => {
        if (!user) {
          reject({ message: "Something Went Wrong", code: 400 });
        } else if (user) {
          if (!user.validPassword(req.body.currentPass)) {
            reject({
              message: "Current Password is not correct",
              code: 400,
            });
          }
        }
        user.password = req.body.newPass;
        return user.save();
      })
      .then((resp) => resolve(resp))
      .catch((error) => {
        reject({ message: `Internal Server Error ${error}`, code: 500 });
      });
  });
};

/* login */

exports.login = (req) => {
  return new Promise(function (resolve, reject) {
    if (validation.isEmpty(req.body.email)) {
      reject({ message: "Enter your email address.", code: 400 });
    } else if (validation.validateEmail(req.body.email) === false) {
      reject({ message: "Enter a valid email address.", code: 400 });
    } else if (validation.isEmpty(req.body.password)) {
      reject({ message: "Please choose a password.", code: 400 });
    }
    console.log(req.body);
    Admin.findOne({
      email: req.body.email,
    })
      .then((user) => {
        console.log(user);
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
          } else if (user.status === "blocked") {
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
              permissions: user.permissions,
            };
            const token = jwt.sign(userObj, config.secrets.key, {
              expiresIn: 6400, // expires in 24 hours
            });
            const data = { token, user: user };
            let date = new Date();
            Admin.findOneAndUpdate(
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
