const Joi = require("joi");

class orderValidate {
  constructor(body) {
    this.orderDetails = body.orderDetails;
    this.totalPrice = body.totalPrice;
    this.Discount = body.Discount;
    this.totalPriceWithDiscount = body.totalPriceWithDiscount;
  }
  validateSchema() {
    const schema = Joi.object().keys({
      orderDetails: Joi.string().optional(),
      totalPrice: Joi.string().optional(),
      Discount: Joi.string().optional(),
      totalPriceWithDiscount: Joi.boolean().optional(),
    });
    return Joi.validate(this, schema);
  }
}
module.exports = orderValidate;
