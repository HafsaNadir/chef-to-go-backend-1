const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderId : {type : Number},
    customerId: { type: Schema.Types.ObjectId, ref: "User" },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    orderDetails: [{
      id : { type: Schema.Types.ObjectId, ref: "Menu" },
      price: { type: String } ,
      name: { type: String } ,
      quantity: { type: Number } 
    }
    ],
    totalPrice: { type: String },
    isDiscount: { type: Boolean },
    totalPriceWithDiscount: { type: String },
    status: { type: String, default: "pending" },
    createdDate: { type: Date , default: Date.now },
    isDeleted: { type: Boolean, default: false },
    orderType: {type: String }
  },
  { timestamp: true }
);


module.exports = mongoose.model("Order", orderSchema);
