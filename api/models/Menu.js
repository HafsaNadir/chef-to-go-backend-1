const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const menuSchema = new Schema(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" , required : true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" , required : true},
    name: { type: String, required: true, trim: true , required : true},
    shortDesc: { type: String, required: true, trim: true },
    longDesc: { type: String, trim: true },
    quantity: { type: Number },
    price: { type: String, default: "$3" },
    isDiscount: { type: Boolean, default: false },
    discountType: {type: String },
    discountValue: { type: Number },
    image: { type: String, default: "default-1.png" },
    status: { type: String, default: "pending"},
    isAvailable: { type: Boolean, default: false }, 
    isDeleted: { type: Boolean, default: false },
    variation : [
      {
        name : { type: String, default: null },
        type: { type: Number }, // 0->single 1->multiple
        items : [{
          name : String,
          price : String
        }]

      }
    ],
  },
  { timestamp: true }
);

// menuItemSchema.methods.validateSchema = function() {
// 	const schema = Joi.object().keys({
// 		cusineName: Joi.string().optional(),
//     restaurantId: Joi.number().optional(),
//     orderBy: Joi.string().optional(),
//     items: Joi.array().items({
//       Name: Joi.string().optional(),
//       shortDesc: Joi.string().optional(),
//       size: Joi.number().optional(),
//       quantity: Joi.number().optional(),
//       price: Joi.string().optional(),
//       isDiscount: Joi.boolean().optional(),
//       image: Joi.string().optional()
//   })
// })
// 	return Joi.validate(this, schema);
// }

module.exports = mongoose.model("Menu", menuSchema);
