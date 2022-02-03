const mongoose = require("mongoose")
const Schema = mongoose.Schema

const categorySchema = new Schema ({
    name: { type: String, required: true, trim: true },
    image: { type: String, default: "default-1.png" },
    shortDesc: { type: String, required: true, trim: true },
    subcategories: [{
        name: { type: String, required: true, trim: true},
    }],
    status: { type: String, default: "inactive"},
    isDeleted: { type: Boolean, default: false }, 
},
{
    timestamps: true
})

module.exports = mongoose.model("Category", categorySchema)