/*
 ** Load Node Modules **
 */
const express = require("express");
const app = express();

app.use(require("sanitize").middleware);

const Admin = require("../models/Admin");
const menu = require("../models/Menu");
const Order = require("../models/Order");
const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Category = require("../models/Category");

exports.totalCustomers = (req) => {
    return new Promise(async (resolve, reject) => {
        const days = req.query.days
        console.log('days', days)
        const obj = days ?
            { userType: 'customer', isDeleted: false, createdAt: { "$gte": (new Date().getTime() - 1000 * 3600 * 24 * days) } } :
            { userType: 'customer', isDeleted: false }
        try {
            count = await User.count(obj)
            resolve(count)
        }
        catch (e) {
            reject({ message: 'Something Went Wrong', code: 400 })
        }
    }
    )
}

exports.totalChefs = (req) => {
    return new Promise(async (resolve, reject) => {
        const days = req.query.days
        console.log('days', days)
        const obj = days ?
            { subType: 'homechef', isDeleted: false, createdAt: { "$gte": (new Date().getTime() - 1000 * 3600 * 24 * days) } } :
            { subType: 'homechef', isDeleted: false }
        try {
            count = await User.count(obj)
            console.log(count)
            resolve(count)
        }
        catch (e) {
            reject({ message: 'Something Went Wrong', code: 400 })
        }
    }
    )
}

exports.totalResOwners = (req) => {
    return new Promise(async (resolve, reject) => {
        const days = req.query.days
        console.log('days', days)
        const obj = days ?
            { subType: 'resowner', isDeleted: false, createdAt: { "$gte": (new Date().getTime() - 1000 * 3600 * 24 * days) } } :
            { subType: 'resowner', isDeleted: false }
        try {
            count = await User.count(obj)
            console.log(count)
            resolve(count)
        }
        catch (e) {
            reject({ message: 'Something Went Wrong', code: 400 })
        }
    }
    )
}

exports.totalOrders = (req) => {
    return new Promise(async (resolve, reject) => {
        const days = req.query.days
        console.log('days', days)
        const obj = days ?
            { isDeleted: false, createdAt: { "$gte": (new Date().getTime() - 1000 * 3600 * 24 * days) } } :
            { isDeleted: false }
        try {
            count = await Order.count(obj)
            console.log(count)
            resolve(count)
        }
        catch (e) {
            reject({ message: 'Something Went Wrong', code: 400 })
        }
    }
    )
}

exports.completedOrders = (req) => {
    return new Promise(async (resolve, reject) => {
        const days = req.query.days
        console.log('days', days)
        const obj = days ?
            { status: 'delivered', isDeleted: false, createdAt: { "$gte": (new Date().getTime() - 1000 * 3600 * 24 * days) } } :
            { status: 'delivered', isDeleted: false }
        try {
            count = await Order.count(obj)
            console.log(count)
            resolve(count)
        }
        catch (e) {
            reject({ message: 'Something Went Wrong', code: 400 })
        }

    }
    )
}

exports.totalSales = (req) => {
    return new Promise(function (resolve, reject) {

    }
    )
}

exports.cancelledOrders = (req) => {
    return new Promise(async (resolve, reject) => {
        const days = req.query.days
        console.log('days', days)
        const obj = days ?
            { status: 'cancelled', isDeleted: false, createdAt: { "$gte": (new Date().getTime() - 1000 * 3600 * 24 * days) } } :
            { status: 'cancelled', isDeleted: false }
        try {
            count = await Order.count(obj)
            console.log(count)
            resolve(count)
        }
        catch (e) {
            reject({ message: 'Something Went Wrong', code: 400 })
        }
    }
    )
}

exports.resOwnerReq = (req) => {
    return new Promise(async (resolve, reject) => {
        const days = req.query.days
        console.log('days', days)
        const obj = days ?
            { status: 'inactive', userType: 'restaurant_owner', isDeleted: false, createdAt: { "$gte": (new Date().getTime() - 1000 * 3600 * 24 * days) } } :
            { status: 'inactive', userType: 'restaurant_owner', isDeleted: false }
        try {
            count = await User.count(obj)
            console.log(count)
            resolve(count)
        }
        catch (e) {
            reject({ message: 'Something Went Wrong', code: 400 })
        }
    }
    )
}

exports.todayCancelOrders = () => {
    return new Promise(async (resolve, reject) => {
        try {
            count = await Order.count({ status: 'cancelled', updatedAt: { $gte: new Date().setHours(0, 0, 0, 0) }, isDeleted: false })
            console.log(count)
            resolve(count)
        }
        catch (e) {
            reject({ message: 'Something Went Wrong', code: 400 })
        }
    }
    )
}

exports.todayPendingOrders = () => {
    return new Promise(async (resolve, reject) => {
        try {
            count = await Order.count({ status: 'pending', updatedAt: { $gte: new Date().setHours(0, 0, 0, 0) }, isDeleted: false })
            console.log(count)
            resolve(count)
        }
        catch (e) {
            reject({ message: 'Something Went Wrong', code: 400 })
        }
    }
    )
}

exports.menuReq = (req) => {
    return new Promise(async (resolve, reject) => {
        const days = req.query.days
        console.log('days', days)
        const obj = days ?
            { status: 'inactive', isDeleted: false, createdAt: { "$gte": (new Date().getTime() - 1000 * 3600 * 24 * days) } } :
            { status: 'inactive', isDeleted: false }
        try {
            count = await menu.count(obj)
            console.log(count)
            resolve(count)
        }
        catch (e) {
            reject({ message: 'Something Went Wrong', code: 400 })
        }
    }
    )
}

exports.totalRestaurants = (req) => {
    return new Promise(async (resolve, reject) => {
        const days = req.query.days
        console.log('days', days)
        const obj = days ?
            { isDeleted: false, createdAt: { "$gte": (new Date().getTime() - 1000 * 3600 * 24 * days) } } :
            { isDeleted: false }
        try {
            count = await Restaurant.count({ isDeleted: false })
            console.log(count)
            resolve(count)
        }
        catch (e) {
            reject({ message: 'Something Went Wrong', code: 400 })
        }
    }
    )
}
