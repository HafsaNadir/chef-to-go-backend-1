/*
 ** Load Node Modules **
 */
const express = require("express");
const app = express();

app.use(require("sanitize").middleware);
const responseHandler = require("../../utility/responseHandler");

const validation = require("../../lib/validation");

const tableJson = require("../../config/table.json");
const Category = require("../models/Category");
const categoryValidate = require("../validation/categoryValidate");

const imagesUpload = require('../../lib/imagesUpload');

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
        //return responseHandler.resHandler(false, null, 'Something went wrong', res, 400);
        reject({ message: "bad request", code: 400 });
      }
      if (req.file.size > 15728640) {
        fs.unlinkSync(`${config.imageConfiguration.path}/${req.file.filename}`);
        //  return responseHandler.resHandler(false, null, 'The file size is too large. Please upload a photo of maximum up to 15MB.', res, 400);
        reject({ message: "bad request", code: 400 });
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
      })
    });
  });
};