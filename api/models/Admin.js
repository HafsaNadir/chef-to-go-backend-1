const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
// const Joi = require('@hapi/joi');

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    emailHash: { type: String },
    password: { type: String, required: true, trim: true },
    passwordHash: { type: String },
    passwordHashAttempt: { type: Number, default: 0 },
    passwordHashDate: { type: Date },
    emailResendAttempt: { type: Number, default: 0 },
    emailResendDate: { type: Date },
    phoneNumber: { type: String, trim: true },
    adminType: { type: String, required: true },
    addresses: [
      {
        address: { type: String, trim: true },
      },
    ],
    status: { type: String, default: 'inactive' },
    createdDate: { type: Date },
    profilePicture: { type: String, default: "default.png"},
    isDeleted: { type: Boolean, default: false },
    lastLogin: { type: Date },
    permissions: {
      dashboard: { type: Boolean, default: false },
      customers: { type: Boolean, default: false },
      subadmins: { type: Boolean, default: false },
      vendors: { type: Boolean, default: false },
      restaurants: { type: Boolean, default: false },
      menus: { type: Boolean, default: false },
      orders: { type: Boolean, default: false },
      categories: { type: Boolean, default: false },
      subscriptions: { type: Boolean, default: false },
      reporting: { type: Boolean, default: false },
      settings: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

// adminSchema.methods.validateSchema = function() {
// 	const schema = Joi.object().keys({
// 		firstName: Joi.string().optional(),
//     lastName: Joi.string().optional(),
//     email: Joi.string().email().optional(),
//     password: Joi.string().optional(),
//     phoneNumber: Joi.string().optional(),
//     adminType: Joi.string().optional(),
//     addresses: Joi.array().items({
//       address: Joi.string().optional(),
//     }),
//     status: Joi.string().optional(),
//     createdDate: Joi.date().optional(),
//     profilePicture: Joi.string().optional(),
//   })
// 	return Joi.validate(this, schema);
// }

adminSchema.methods.toJSON = function() {
  const admin = this
  const adminObject = admin.toObject()
  delete adminObject.password

  return adminObject
}  

adminSchema.pre('save', async function(next) {
  const admin = this
  if(admin.isModified('password')){
      admin.password = await bcrypt.hash(admin.password, bcrypt.genSaltSync(10))
  }
  console.log('just before saving')
  next()
})

// adminSchema.methods.generateHash = function (password) {
//   return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
// };

adminSchema.methods.validPassword = function (password) {
  console.log(password)
  console.log(bcrypt.compareSync(password, this.password))
  return bcrypt.compareSync(password, this.password)
};

module.exports = mongoose.model("Admin", adminSchema)
