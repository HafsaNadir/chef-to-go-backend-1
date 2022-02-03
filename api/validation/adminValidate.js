const Joi = require("joi");

class adminValidate {
  constructor(body) {
    this.firstName = body.firstName;
    this.lastName = body.lastName;
    this.email = body.email;
    this.password = body.password;
    this.phoneNumber = body.phoneNumber;
    this.addresses = body.addresses;
    this.profilePicture = body.profilePicture;
  }
  validateSchema() {
    const schema = Joi.object().keys({
      firstName: Joi.string().optional(),
      lastName: Joi.string().optional(),
      email: Joi.string().email().optional(),
      password: Joi.string().optional(),
      phoneNumber: Joi.string().optional(),
      addresses: Joi.array().items({
        address: Joi.string().optional(),
      }),
      profilePicture: Joi.optional(),
    });
    return Joi.validate(this, schema);
  }
}
module.exports = adminValidate;
