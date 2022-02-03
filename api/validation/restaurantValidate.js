const Joi = require("joi");

class restaurantValidate {
  constructor(body) {
    this.name = body.name
    this.tagline = body.tagline
    this.shortDesc = body.shortDesc
    this.longDesc = body.longDesc  
    this.image = body.image
    this.coverPhoto = body.coverPhoto
    this.locations = body.locations
    this.discountAvailable = body.discountAvailable
    this.discountPercent = body.discountPercent
    this.delivery = body.delivery
    this.details = body.details
    this.phoneNumber = body.phoneNumber
    this.email = body.email
    this.addresses = body.addresses
    this.lat = body.lat
    this.long = body.long
    this.delivery = body.delivery
    this.deliveryFee = body.deliveryFee
    this.dineIn = body.dineIn
    this.takeAway = body.takeAway
    this.minOrder = body.minOrder
    this.restaurantOwnerId = body.restaurantOwnerId
  }
  validateSchema() {
    const schema = Joi.object().keys({
        name: Joi.string().optional(),
        tagline: Joi.string().optional(),
        shortDesc: Joi.string().optional(),
        longDesc: Joi.string().optional(),
        image: Joi.string().optional(),
        coverPhoto: Joi.string().optional(),
        locations: Joi.array().items({
            location: Joi.string().optional()
        }),
        discountAvailable: Joi.boolean().optional(),
        discountPercent:Joi.string().optional(),
        delivery: Joi.boolean().optional(),
        details: Joi.string().optional(),
        phoneNumber: Joi.string().optional(),
        email: Joi.string().optional(),
        addresses: Joi.array().optional(),
        lat: Joi.string().optional(),
        long: Joi.string().optional(),
        delivery: Joi.boolean().optional(),
        deliveryFee: Joi.string().optional(),
        dineIn: Joi.boolean().optional(),
        takeAway: Joi.boolean().optional(),
        minOrder: Joi.number().optional(),
        restaurantOwnerId: Joi.optional()
    });
    return Joi.validate(this, schema);
  }
}
module.exports = restaurantValidate;