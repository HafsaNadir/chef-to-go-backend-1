const Joi = require('joi');
class userValidate {
  constructor(body)
    {    
      this.firstName = body.firstName 
      this.lastName = body.lastName 
      this.email = body.email 
      this.password = body.password 
      this.phoneNumber = body.phoneNumber
      this.addresses = body.addresses
      this.profilePicture = body.profilePicture
      this.businessName = body.businessName
      this.businessDetail = body.businessDetail
    }
       
  validateSchema () {
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
      businessName: Joi.string().optional(),
      businessDetail: Joi.string().optional()
    })
    return Joi.validate(this, schema)
    }
}

module.exports = userValidate;