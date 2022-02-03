const Joi = require("joi");

class categoryValidate {
  constructor(body) {
    this.name = body.name
    this.shortDesc = body.shortDesc
    this.image = body.image
    this.subcategories = body.subcategories
  }
  validateSchema() {
    const schema = Joi.object().keys({
        name: Joi.string().optional(),
        shortDesc: Joi.string().optional(),
        image: Joi.string().optional(),
        subcategories: Joi.array().items({
            name: Joi.string().optional(),
            // shortDesc: Joi.string().optional(),
            // image: Joi.string().optional() 
        })
    });
    return Joi.validate(this, schema);
  }
}
module.exports = categoryValidate;