/*
 ** Load Node Modules **
 */
const express = require("express");
const app = express();

app.use(require("sanitize").middleware);
const responseHandler = require("../../utility/responseHandler");

const validation = require("../../lib/validation");

const tableJson = require("../../config/table.json");
const Restaurant = require("../models/Restaurant");

const Menu = require("../models/Menu");

const restaurantValidate = require("../validation/restaurantValidate");


const imagesUpload = require('../../lib/imagesUpload');

exports.createRestaurant = (data) => {
  return new Promise(function (resolve, reject) {
    Restaurant.create(data)
      .then((resp) => {
        resolve(resp)
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

exports.editRestaurant = (req) => {
  return new Promise(function (resolve, reject) {
    if (validation.isEmpty(req.body.name)) {
      reject({ message: 'Please enter restaurant name', code: 400 });
    }
    else if (validation.isEmpty(req.body.details)) {
      reject({ message: 'Please enter restaurant details', code: 400 });
    }
    else if (validation.isEmpty(req.body.phoneNumber)) {
      reject({ message: 'Phone number required', code: 400 });
    }
    else if (validation.isEmpty(req.body.address)) {
      reject({ message: 'Address required', code: 400 });
    }
    const reqObject = {
      name: req.body.name,
      email: req.body.email,
      details: req.body.details,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
    }
    Restaurant.findOneAndUpdate({ restaurantOwnerId: req.user.id }, reqObject, { new: true })
      .then((resp) => {
        if (!resp) {
          reject({ message: "Something went wrong", code: 400 });
        }
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
      })
  })
}
exports.editTimings = (req) => {
  return new Promise(function (resolve, reject) {
    console.log(req.body)
    const reqObject = {
      time: req.body.time
    }
    console.log(reqObject)
    Restaurant.findOneAndUpdate({ restaurantOwnerId: req.user.id }, reqObject, { new: true })
      .then((resp) => {
        if (!resp) {
          reject({ message: "Something went wrong", code: 400 });
        }
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
      })

  })
}
exports.editPreferences = (req) => {
  return new Promise(function (resolve, reject) {
    if (validation.isEmpty(req.body.minOrder)) {
      reject({ message: 'Min order required', code: 400 });
    }
    else if (validation.isEmpty(req.body.state)) {
      reject({ message: 'state required', code: 400 });
    }
    else if (validation.isEmpty(req.body.city)) {
      reject({ message: 'city required', code: 400 });
    }
    else if (validation.isEmpty(req.body.country)) {
      reject({ message: 'country required', code: 400 });
    }
    else if (validation.isEmpty(req.body.shortDescDiscount)) {
      reject({ message: 'discount description required', code: 400 });
    }
    else if (validation.isEmpty(req.body.longDescDiscount)) {
      reject({ message: 'discount description required', code: 400 });
    }
    else if (validation.isEmpty(req.body.tax)) {
      reject({ message: 'tax required', code: 400 });
    }

    const reqObject = {
      delivery: req.body.delivery,
      deliveryFee: req.body.deliveryFee,
      dineIn: req.body.dineIn,
      takeAway: req.body.takeAway,
      minOrder: req.body.minOrder,
      state: req.body.state,
      city: req.body.city,
      country: req.body.country,
      shortDescDiscount: req.body.shortDescDiscount,
      longDescDiscount: req.body.longDescDiscount,
      tax: req.body.tax
    }
    Restaurant.findOneAndUpdate({ restaurantOwnerId: req.user.id }, reqObject, { new: true })
      .then((resp) => {
        if (!resp) {
          reject({ message: "Something went wrong", code: 400 });
        }
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
      })
  });
}

exports.getMyRestaurant = (id) => {
  return new Promise(function (resolve, reject) {
    Restaurant.findOne({
      restaurantOwnerId: id
    })
      .then(resp => {
        console.log('resp', resp);
        if (resp != null) {
          resolve(resp);

        } else {
          reject("Invalid Access");

        }

      })
      .catch(error => {
        reject(error);

      })
  })

}


exports.getAllRestaurant = (req) => {
  return new Promise(function (resolve, reject) {
    Restaurant.find({
      isDeleted: false,
      location: {
        $near: {
          $maxDistance: 10000,
          $geometry: { type: "Point", coordinates: [ req.query.long , req.query.lat] }
        }
      }
    })
.then(resp => {
        if (resp != null) {
          const promises = [];
          resp.map(r=>{
              promises.push(getMenuName(r,1));

          });
          Promise.all(promises).then(results => {
            console.log('results',results);
            resolve(results);
  
           })
           .catch(error =>{
            reject(error);

           })
            

        } else {
          reject("Invalid Access");

        }

      })
      .catch(error => {
        reject(error);

      })
  })

}


getMenuName = (resp,i) => {
  return new Promise(function(resolve, reject) {
    Menu.find({
      restaurantId : resp.id
    })
    .populate("categoryId")
    .then(r =>{
      let result = new Object();
      let categoryNames = [];
      r.map(re =>{
        if(!categoryNames.includes(re.categoryId.name)){
          categoryNames.push(re.categoryId.name);

        }
      })
      result['categoryName'] = categoryNames;

      if(i === 0){
        result['menuData'] = r;
  
      }
      result['name'] = resp.name;
      result['city'] = resp.city;
      result['state'] = resp.state;
      result['coverPhoto'] = resp.coverPhoto;
      result['image'] = resp.image;
      result['delivery'] = resp.delivery;
      result['dineIn'] = resp.dineIn;
      result['takeAway'] = resp.takeAway;
      result['slug'] = resp.slug;
      result['deliveryFee'] = resp.deliveryFee;
      result['minOrder'] = resp.minOrder;
      


      resolve(result);
    })
    .catch(e=>{
      console.log('e',e);
      reject(e);

    })
  });
}


exports.editLocation = (req) => {
  return new Promise(function (resolve, reject) {
    if (validation.isEmpty(req.body.lat)) {
      reject({ message: 'latitude required', code: 400 });
    }
    else if (validation.isEmpty(req.body.long)) {
      reject({ message: 'longitude required', code: 400 });
    }
    let loc = {
      location: {
        coordinates: [req.body.long,req.body.lat],
        type: "Point"
      }
    };
    Restaurant.findOneAndUpdate({ restaurantOwnerId: req.user.id }, loc, { new: true })
      .then((resp) => {
        if (!resp) {
          reject({ message: "Something Went Wrong", code: 400 });
        }
        resolve(resp.status);
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );


  })
}

exports.getRestaurantAllOrders = (req) => {
  return new Promise(function (resolve, reject) {
    const pageOptions = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    };
    Restaurant.findById({ _id: req.params.id })
      .then((result) => {
        if (!result) {
          reject({ message: "Something Went Wrong", code: 400 });
        }
        result
          .populate({
            path: "orders",
            options: {
              limit: pageOptions.limit,
              skip: (pageOptions.page - 1) * pageOptions.limit,
            },
          })
          .execPopulate()
          .then((data) => {
            if (!data) {
              reject({ message: "No Orders Found", code: 200 });
            }
            resolve(data.orders);
          })
          .catch((err) =>
            reject({ message: `Internal Server Error ${err}`, code: 500 })
          );
      })
      .catch((error) =>
        reject({ message: `Internal Server Error ${error}`, code: 500 })
      );
  });
};

exports.deliveryStatusChangeRestaurant = (id, data) => {
  return new Promise(function (resolve, reject) {
    Restaurant.findOneAndUpdate({ _id: id }, data, { new: true })
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


exports.imageUploadRestaurant = (req, res) => {
  return new Promise(function (resolve, reject) {
    let image;
    imagesUpload.uploadImage(req, res, function (err) {
      if (err) {
        console.log('req.file', req.file);
        console.log('img err ', err);
        reject({ message: "bad request", code: 400 });

      }
      if (req.file == null || req.file == undefined) {
        // reject({ message: "file null", code: 400 });
        image = req.body.image;
      }
      else {
        if (req.fileValidationError) {
          reject({ message: "bad request", code: 400 });

        }
        if (typeof req.file == 'undefined') {
          reject({ message: "bad request", code: 400 });

        }
        if (req.file.size > 15728640) {
          fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
          reject({ message: "bad request", code: 400 });

        }
        image = req.file.filename;

      }
      let reqObject = {
        image: image
      };
      console.log('reqObject', reqObject);
      Restaurant.findOne({
        restaurantOwnerId: req.user.id
      })
        .then(resp => {
          console.log('resp', resp);
          if (resp != null) {

            console.log('reqObject', reqObject);
            let queryObj = { restaurantOwnerId: req.user.id };
            console.log('queryObj', queryObj);
            Restaurant.findOneAndUpdate(queryObj, reqObject, { new: true })
              .then((resp) => {
                if (!resp) {
                  reject({ message: "No data found", code: 400 });
                }
                resolve(resp);
              })
              .catch((error) =>
                reject({ message: `Internal Server Error ${error}`, code: 500 })
              );

            /* */

          } else {
            reject({ message: "bad request", code: 400 });

          }

        })
        .catch(error => {
          reject({ message: `Internal Server Error ${error}`, code: 500 });

        });


    });

  });
};


exports.coverImageUploadRestaurant = (req, res) => {
  return new Promise(function (resolve, reject) {
    let image;
    imagesUpload.uploadImage(req, res, function (err) {
      if (err) {
        console.log('req.file', req.file);
        console.log('img err ', err);
        reject({ message: "bad request", code: 400 });

      }
      if (req.file == null || req.file == undefined) {
        reject({ message: "file null", code: 400 });
        //  image = req.body.image;        
      }
      else {
        if (req.fileValidationError) {
          reject({ message: "bad request", code: 400 });

        }
        if (typeof req.file == 'undefined') {
          reject({ message: "bad request", code: 400 });

        }
        if (req.file.size > 15728640) {
          fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
          reject({ message: "bad request", code: 400 });

        }
        image = req.file.filename;

      }
      let reqObject = {
        coverPhoto: image
      };
      console.log('reqObject', reqObject);
      Restaurant.findOne({
        restaurantOwnerId: req.user.id
      })
        .then(resp => {
          console.log('resp', resp);
          if (resp != null) {

            console.log('reqObject', reqObject);
            let queryObj = { restaurantOwnerId: req.user.id };
            console.log('queryObj', queryObj);
            Restaurant.findOneAndUpdate(queryObj, reqObject, { new: true })
              .then((resp) => {
                if (!resp) {
                  reject({ message: "No data found", code: 400 });
                }
                resolve(resp);
              })
              .catch((error) =>
                reject({ message: `Internal Server Error ${error}`, code: 500 })
              );

            /* */

          } else {
            reject({ message: "bad request", code: 400 });

          }

        })
        .catch(error => {
          reject({ message: `Internal Server Error ${error}`, code: 500 });

        });


    });

  });
};

exports.getRestaurantBySlug = (slug) => {
  return new Promise(function (resolve, reject) {
    Restaurant.findOne({
      slug
    })
      .then(resp => {
        console.log('resp', resp);
        if (resp != null) {
          const promises = [];
              promises.push(getMenuName(resp,0));

          Promise.all(promises).then(results => {
            console.log('results',results);
            resolve(results[0]);
  
           })
           .catch(error =>{
            reject(error);

           })

        } else {
          reject("Invalid Access");

        }

      })
      .catch(error => {
        reject(error);

      })
  })

}