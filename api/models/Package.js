const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const packageSchema = new Schema(
    {
        name: { type: String,  trim: true, unique: true },
        shortDesc: { type: String, trim: true },
        packageType: { type: String },
        status: { type: String, default: 'inactive' },
        isDeleted: { type: Boolean, default: false }, 
    },
    { timestamps: true }
);

module.exports = mongoose.model("Package", packageSchema);
