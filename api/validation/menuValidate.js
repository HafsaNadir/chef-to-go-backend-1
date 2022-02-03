const Joi = require("joi");

class menuValidate {
  constructor(body) {
    this.name = body.name
    this.shortDesc = body.shortDesc
    this.quantity = body.quantity
    this.price = body.price
    this.image = body.image
    this.isAvailable = body.isAvailable
    this.variation = body.variation
    this.categoryId = body.categoryId
  }
  validateSchema() {
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        categoryId: Joi.string().required(),

        shortDesc: Joi.string().optional(),
        quantity: Joi.number().optional(),
        price: Joi.string().required(),
        image: Joi.string().optional(),
        isAvailable: Joi.boolean().optional(),
        variation: Joi.array().items({
            name: Joi.string().optional(),
            type: Joi.number().optional(),
            items: Joi.array().items({
              name: Joi.string().optional(),
              price: Joi.string().optional()
            })
        })
    });
    return Joi.validate(this, schema);
  }
}
module.exports = menuValidate;