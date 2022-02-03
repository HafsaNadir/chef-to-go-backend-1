const path = require('path');
var app = require('express')();
const config = require('./config/environment');

const responseHandler = require('./utility/responseHandler');

module.exports = (app) => {

    /**************  admin Routes  **********************************/
    app.use('/api/v1/backstage', require('./api/admin/admin.routes'));

    /**************  customer Routes  **********************************/
    app.use('/api/v1/customer', require('./api/customer/customer.routes'));

    /**************  menu Routes  **********************************/
    app.use('/api/v1/menu', require('./api/menu/menu.routes'));

    /**************  order Routes  **********************************/
    app.use('/api/v1/order', require('./api/order/order.routes'));

    /**************  retaurant_owner Routes  **********************************/
    app.use('/api/v1/restaurant_owner', require('./api/restaurant_owner/restaurant_owner.routes'));

    /**************  category Routes  **********************************/
    app.use('/api/v1/category', require('./api/category/category.routes'));

    /**************  restaurant Routes  **********************************/
    app.use('/api/v1/restaurant', require('./api/restaurant/restaurant.routes'));

    app.use('/api/v1/dashboard', require('./api/dashboard/dashboard.routes'))

    /**************  common Routes  **********************************/
   app.use('/api/v1', require('./api/common/common.routes'));

    app.route('/*')
        .get((req, res) => {
            res.send({'error':'404'});
        });
}