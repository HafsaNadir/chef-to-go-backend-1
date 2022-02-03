const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const config = require("../config/environment")

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, config.imageConfiguration.path);
  },
  filename(req, file, cb) {
    crypto.pseudoRandomBytes(16, (err, raw) => {
      if (err) return cb(err);
      cb(null, raw.toString('hex') + path.extname(file.originalname));
    });
  },
  onFileUploadComplete() {
  },
  onError(error, next) {
    console.log('errrrrrrrrrrrr', error)
    next(error);
  },
});

exports.upload = multer({
  storage: storage, fileFilter(req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
    if (file.mimetype !== 'image/*' && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg') {
      console.log('extt11', file.mimetype);
      req.fileValidationError = true;
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    const fileExtension = path.extname(file.originalname).toLowerCase();
    console.log('extt1', fileExtension);
    if (fileExtension !== '.jpg' && fileExtension !== '.jpeg' && fileExtension !== '.png') {
      console.log('extt', fileExtension);
      req.fileValidationError = true;
      return cb(null, false, new Error('goes wrong on the mimetype'));
    }
    // To reject this file pass `false`, like so:
    // cb(null, false)

    // To accept the file pass `true`, like so:
    cb(null, true)

    // You can always pass an error if something goes wrong:
    // cb(new Error('I don\'t have a clue!'))

  },
}).array('image', 3);


exports.uploadImage = multer({
  storage: storage, fileFilter(req, file, cb) {

    // The function should call `cb` with a boolean
    // to indicate if the file should be accepted
        console.log('file',file);
        console.log('file',file);


    if (file.mimetype != 'image/*' && file.mimetype != 'image/jpeg' && file.mimetype != 'image/png' && file.mimetype != 'image/jpg') {
      console.log('image con 1', file.mimetype);
      req.fileValidationError = true;
      return cb(null, false, new Error('Invalid Image Type'));
    }
    const fileExtension = path.extname(file.originalname).toLowerCase();
    console.log('extt1', fileExtension);
    if (fileExtension !== '.jpg' && fileExtension !== '.jpeg' && fileExtension !== '.png') {
      console.log('extt', fileExtension);
      req.fileValidationError = true;
      return cb(null, false, new Error('Invalid Image Type'));
    }
    else{
      cb(null, true);
    }

    // To reject this file pass `false`, like so:
    // cb(null, false)

    // To accept the file pass `true`, like so:
    

    // You can always pass an error if something goes wrong:
    // cb(new Error('I don\'t have a clue!'))

  }
  
}).single('file');
