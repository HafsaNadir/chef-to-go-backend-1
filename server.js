const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const path = require("path");
const session = require("express-session")
const app = express();
const server = require('http').createServer(app);
const fs = require('fs');
const jwt = require('jsonwebtoken')
let key = fs.readFileSync('./certificate/privkey.pem');
let cert = fs.readFileSync('./certificate/cert.pem');

// const server = require('https').createServer({
//   key: fs.readFileSync('./certificate/privkey.pem'),
//   cert: fs.readFileSync('./certificate/cert.pem'),
//   rejectUnauthorized: false

// },app);


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const helmet = require('helmet')
app.set('superSecret', 'nodeIsFuture');


process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = require('./config/environment');
app.use(
  session({
    secret: config.secrets.key,
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60000000000
    }
  })
);
const env = app.get('env');

app.use(helmet());
app.use(helmet.frameguard());

app.disable('x-powered-by');
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

if (env === 'development') {
  app.use(morgan('dev'));
}

app.use(morgan('dev'));
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/chef-to-ho');

Promise = require('bluebird');
mongoose.Promise = Promise;


require('./routes')(app);

const socketIO = require('socket.io');
const io = socketIO(server);
const documents = {};


const UserSocketID = require('./userSocketID');
const Restaurant = require('./api/models/Restaurant');
const Notification = require('./api/models/Notification');
const User = require('./api/models/User');

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('user', (token) => {
    if (!token) return;
    user = jwt.verify(token, config.secrets.key)
    socket.join(user.email)
    
    UserSocketID.findOne({ userId: user.id }).then(result => {
      if (result) {
        const user = result;
        user.socketId.push(socket.id);
        user.save().then();
      } else {
        const userSocketIDs = new UserSocketID();
        userSocketIDs.userId = user.id;
        userSocketIDs.email = user.email
        userSocketIDs.name = `${user.firstName} ${user.lastName}`
        userSocketIDs.socketId = [socket.id]
        userSocketIDs.save().then();
      }
    });
  })
  socket.on('sendMessage', (obj) => {
    const notification = new Notification()
    notification.message = obj.message
    notification.orderId = obj.orderId
    notification.orderNo = obj.orderNo
    notification.customerId = obj.customerId
    notification.restaurantId = obj.restaurantId
    notification.save()
    User.findOne({ _id: obj.customerId }).
    then(res => {
      console.log('socket res', res)
        if (res) {
            io.to(res.email).emit('notify', { message: obj.message, orderId: obj.orderNo})
            socket.emit('success', 'Message successfully sent');
        }
    })
    .catch(e =>{
      socket.emit('error', 'Message not sent');
    })
  })
  
  socket.on('sendMessageToRestaurant', (obj) => {
    const notification = new Notification()
    notification.message = obj.message
    notification.orderId = obj.orderId
    notification.orderNo = obj.orderNo
    notification.customerId = obj.customerId
    notification.restaurantId = obj.restaurantId
    notification.save()
    Restaurant.findOne({ _id: obj.restaurantId }).
    then(resp => {
      User.findOne({ _id: resp.restaurantOwnerId })
      .then(res => {
        console.log('socket res', res)
        if (res) {
            io.to(res.email).emit('notify', { message: obj.message, orderId: obj.orderNo})
            socket.emit('success', 'Message successfully sent');
        }
      })
      
    })
    .catch(e =>{
      socket.emit('error', 'Message not sent');
    })
  })
  
  socket.on('send', (email) => {
  //  console.log('e',email);
    Restaurant.findOne({
      _id : email.restaurantId
    })
    .then(r=>{
      UserSocketID.findOne({ userId: r.restaurantOwnerId }).then(result => {
        if (result) {
    //      console.log('f',result)
          if (result) {
            io.to(result.email).emit('notification', 'You have recieved 1 new order #'+email.orderId)
          }
        }
      })
  
    })
    .catch(e =>{

    })
  })


  socket.on('disconnect', () => {
    UserSocketID.find({}).then(response => {
      if (response && response.length > 0) {
        response.map((currElement) => {
          const socketIndex = currElement.socketId.indexOf(socket.id);
          if (socketIndex > -1) {
            currElement.socketId.splice(socketIndex, 1);
            if (currElement.socketId.length === 0) {
              UserSocketID.remove({ userId: currElement.userId }).then();
            } else {
              currElement.save().then();
            }
          }
        });
      }
    });

  });
});



server.listen(config.port, config.ip, () => {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));

});
