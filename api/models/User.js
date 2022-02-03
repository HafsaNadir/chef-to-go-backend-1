const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    emailHash: { type: String },
    isEmailVerified: {type: Boolean, default: false},
    password: { type: String, trim: true },
    passwordHash: { type: String },
    passwordHashAttempt: { type: Number, default: 0 },
    passwordHashDate: { type: Date },
    emailResendAttempt: { type: Number, default: 0 },
    emailResendDate: { type: Date },
    phoneNumber: { type: String, trim: true },
    businessName: { type: String, trim: true, unique: true, sparse: true },
    businessDetail: { type: String, trim: true },
    userType: { type: String },
    subType: {type: String },
    addresses: [
      {
        address: { type: String, trim: true },
      },
    ],
    address: {
      floor: { type: String } ,
      area: { type: String } ,
      building: { type: String } ,
      street: { type: String } ,
    },
    status: { type: String, default: "inactive" },
    createdDate: { type: Date },
    profilePicture: { type: String, default: "default.png" },
    isDeleted: { type: Boolean, default: false },
    lastLogin: { type: Date },
    isSocialLogin: { type: Boolean },
    socialDetails: {
      socialId: { type: String },
      socialAccType: { type: String }
    },
  },
  { timestamps: true }
);

userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'customerId'
})


// userSchema.methods.validateSchema = function () {
//   const schema = Joi.object().keys({
//     firstName: Joi.string(),
//     lastName: Joi.string().required(),
//     email: Joi.string().required(),
//     emailHash: Joi.string().optional(),
//     password: Joi.string().required(),
//     passwordHash: Joi.string().optional(),
//     passwordHashAttempt: Joi.number().optional(),
//     passwordHashDate: Joi.date().optional(),
//     emailResendAttempt: Joi.number().optional(),
//     emailResendDate: Joi.date().optional(),
//     phoneNumber: Joi.string().optional(),
//     userType: Joi.string(),
//     addresses: Joi.array().items({
//       address: Joi.string().optional(),
//     }),
//     status: Joi.string().optional(),
//     createdDate: Joi.date().optional(),
//     profilePicture: Joi.string().optional(),
//   });
//   return schema.validate(this);
// };

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, bcrypt.genSaltSync(10));
  }
  console.log("just before saving");
  next();
});

// userSchema.methods.generateHash = function (password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// };

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
};

module.exports = mongoose.model("User", userSchema);
