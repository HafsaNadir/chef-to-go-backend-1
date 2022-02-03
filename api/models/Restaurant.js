const mongoose = require("mongoose");
const { string } = require("joi");
const Schema = mongoose.Schema;

const restaurantSchema = new Schema(
  {
    name: { type: String,  trim: true, unique: true },
    tagline: { type: String, trim: true },
    shortDesc: { type: String, trim: true },
    longDesc: { type: String,  trim: true },
    image: { type: String, default: "default-1.png" },
    coverPhoto: { type: String, default: "restaurant-cover-default.webp" },
    status: { type: String, default: 'inactive' },
    createdDate: { type: Date },
    createdBy: { type: String },
    restaurantOwnerId: { type: Schema.Types.ObjectId, ref: "User" },
    locations: [
      {
        location: { type: String, trim: true },
      },
    ],
    location: {
      type: { type: String },
      coordinates: [mongoose.Schema.Types.Mixed]
    },
    discountAvailable: { type: Boolean, default: false },
    discountPercent: { type: String },
    isDeleted: { type: Boolean, default: false },
    details: { type: String, trim: true },
    phoneNumber: {type: String, trim: true},
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    lat: {type: String },
    long: {type: String },
    delivery: { type: Boolean, default: false },
    deliveryFee: { type: String },
    dineIn: { type: Boolean, default: false },
    takeAway: { type: Boolean, default: false },
    minOrder: { type: Number },
    time:
    {
        monday: {
          openTime: { type: String },
          closeTime: { type: String }
        },
        tuesday: {
          openTime: { type: String },
          closeTime: { type: String }
        },
        wednesday: {
          openTime: { type: String },
          closeTime: { type: String }
        },
        thursday: {
          openTime: { type: String },
          closeTime: { type: String }
        },
        friday: {
          openTime: { type: String },
          closeTime: { type: String }
        },
        saturday: {
          openTime: { type: String },
          closeTime: { type: String }
        },
        sunday: {
          openTime: { type: String },
          closeTime: { type: String }
        }
    },
    openTime: {type: String },
    closeTime: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    shortDescDiscount: { type: String },
    longDescDiscount: { type: String },
    slug : { type: String,trim: true, unique: true },
    tax: {type: String }
  },
  { timestamps: true }
);


restaurantSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'restaurantId'
})

restaurantSchema.virtual('mdata', {
  ref: 'Menu',
  localField: '_id',
  foreignField: 'restaurantId'
})


restaurantSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Restaurant", restaurantSchema);
