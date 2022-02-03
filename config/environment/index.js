const _ = require('lodash');
const path = require('path');

let requiredProcessEnv = (name) => {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
};

let environmentSettings = {
    env: process.env.NODE_ENV,
    root: path.normalize(`${__dirname}/../../`),
    port: process.env.PORT || 3000,
    ip: process.env.IP || '0.0.0.0',
    secrets: {
        key: 'ad01APt$#@!!!!'
    },
    baseUrl : 'https://cheftogo.net:3000/',
    clientUrl: 'https://cheftogo.net/',
    mongoUrl: "mongodb://localhost/foodToChef",
    imageConfiguration: {
        path: 'public/uploads'
    },
};
module.exports = _.merge(environmentSettings, require('./' + process.env.NODE_ENV + '.js') || {})
