const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = mongoose.Schema({
    customerId: { type: Schema.Types.ObjectId, ref: "User" },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant" },
    orderId: { type: Schema.Types.ObjectId, ref: "Order"},
    orderNo: {type: String},
    message: { type: String },
    createdDate: { type: Date , default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);