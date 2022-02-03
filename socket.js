const Chat = require('./chat.js');
const Notification = require('../models/notification');
const DateDiff = require('date-diff');
const UserSocketID = require('.//userSocketID');

module.exports = function (app, io) {
  const userSocketID = [];
  const onlineUsers = [];

  function emitError(userId, message, error) {
    io.to(userId).emit('error', { message, error });
  }

  io.on('connection', (socket) => {
    // console.log('user connected', socket.id);
    socket.on('userInfo', (object) => {
      if (!object.userId) return;

      UserSocketID.find({ userId: object.userId }).then(result => {
        if (result && result.length > 0) {
          const user = result[0];
          user.socketId.push(socket.id);
          user.save().then();
        } else {
          const userSocketIDs = new UserSocketID();
          userSocketIDs.userId = object.userId;
          userSocketIDs.socketId = [socket.id];
          userSocketIDs.save().then();
        }
      });
    });

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

    socket.on('getUserStatus', () => {
      // io.emit('onlineUsers', onlineUsers);
    });


    socket.on('addToChatList', (object) => {
      const newObj = object;
      UserSocketID.find({ userId: object.userOne }).then(response => {
        if (response && response.length > 0) {
          newObj.userSocketID = response[0].socketId;
        } else {
          newObj.userSocketID = [];
        }
        Chat.addToChatList(newObj, io);
      });

      // const newObj = object;
      // const index = userSocketID.findIndex(x => x.userId === object.userOne);
      // if (index > -1) {
      //   newObj.userSocketID = userSocketID[index].socketId;
      // } else {
      //   newObj.userSocketID = [];
      // }
      // Chat.addToChatList(newObj, io);
      // io.emit('onlineUsers', onlineUsers);
    });

    socket.on('chatList', (object) => {
      const newObj = { userId: object.userId };
      UserSocketID.find({ userId: object.userId }).then(response => {
        if (response && response.length > 0) {
          newObj.userSocketID = response[0].socketId;
        } else {
          newObj.userSocketID = [];
        }
        Chat.chatList(newObj, io);
      });

      // const newObj = { userId: object.userId };
      // const index = userSocketID.findIndex(x => x.userId === object.userId);
      // if (index > -1) {
      //   newObj.userSocketID = userSocketID[index].socketId;
      // } else {
      //   newObj.userSocketID = [];
      // }
      // Chat.chatList(newObj, io);
      // io.emit('onlineUsers', onlineUsers);
    });

    socket.on('updateIsRead', (object) => {
      const newObj = { conversationId: object.conversationId };
      UserSocketID.find({ userId: object.userId }).then(response => {
        if (response && response.length > 0) {
          newObj.userSocketID = response[0].socketId;
        } else {
          newObj.userSocketID = [];
        }
        Chat.updateIsRead(newObj, io);
      });

      // const newObj = { conversationId: object.conversationId };
      // const index = userSocketID.findIndex(x => x.userId === object.userId);
      // if (index > -1) {
      //   newObj.userSocketID = userSocketID[index].socketId;
      // } else {
      //   newObj.userSocketID = [];
      // }
      // Chat.updateIsRead(newObj, io);
      // io.emit('onlineUsers', onlineUsers);
    });

    socket.on('chatObjectByID', (object) => {
      const newObj = { conversationId: object.conversationId };
      UserSocketID.find({ userId: object.userId }).then(response => {
        if (response && response.length > 0) {
          newObj.userSocketID = response[0].socketId;
        } else {
          newObj.userSocketID = [];
        }
        Chat.chatObjectByID(newObj, io);
      });

      // const newObj = { conversationId: object.conversationId };
      // const index = userSocketID.findIndex(x => x.userId === object.userId);
      // if (index > -1) {
      //   newObj.userSocketID = userSocketID[index].socketId;
      // } else {
      //   newObj.userSocketID = [];
      // }
      // Chat.chatObjectByID(newObj, io);
      // io.emit('onlineUsers', onlineUsers);
    });

    socket.on('conversation', (object) => {
      const newObj = { conversationId: object.conversationId };
      UserSocketID.find({ userId: object.userId }).then(response => {
        if (response && response.length > 0) {
          newObj.userSocketID = response[0].socketId;
        } else {
          newObj.userSocketID = [];
        }
        Chat.conversation(newObj, io);
      });

      // const newObj = { conversationId: object.conversationId };
      // const index = userSocketID.findIndex(x => x.userId === object.userId);
      // if (index > -1) {
      //   newObj.userSocketID = userSocketID[index].socketId;
      // } else {
      //   newObj.userSocketID = [];
      // }
      // Chat.conversation(newObj, io);
      // io.emit('onlineUsers', onlineUsers);
    });

    socket.on('sendMessage', (object) => {
      const newObj = {
        senderId: object.userId,
        receiverId: object.receiverId,
        type: object.type,
        reply: object.reply,
        fileType: object.fileType,
        downloadFile: object.downloadFile,
      };

      UserSocketID.find({ userId: object.userId }).then(response => {
        if (response && response.length > 0) {
          newObj.senderSocketID = response[0].socketId;
        } else {
          newObj.senderSocketID = [];
        }
        UserSocketID.find({ userId: object.receiverId }).then(response1 => {
          if (response1 && response1.length > 0) {
            newObj.receiverSocketID = response1[0].socketId;
          } else {
            newObj.receiverSocketID = [];
          }
          Chat.sendMessage(newObj, io);
        });
      });

      // const newObj = {
      //   senderId: object.userId,
      //   // senderSocketID: userSocketID[object.userId],
      //   // receiverSocketID: userSocketID[object.receiverId],
      //   receiverId: object.receiverId,
      //   type: object.type,
      //   reply: object.reply,
      //   fileType: object.fileType,
      //   downloadFile: object.downloadFile,
      // };

      // let index = userSocketID.findIndex(x => x.userId === object.userId);
      // if (index > -1) {
      //   newObj.senderSocketID = userSocketID[index].socketId;
      // } else {
      //   newObj.senderSocketID = [];
      // }
      // index = userSocketID.findIndex(x => x.userId === object.receiverId);
      // if (index > -1) {
      //   newObj.receiverSocketID = userSocketID[index].socketId;
      // } else {
      //   newObj.receiverSocketID = [];
      // }
      // Chat.sendMessage(newObj, io);
      // io.emit('onlineUsers', onlineUsers);
    });

    socket.on('sendFeed', (feed) => {
      io.in(feed.projectId).emit('newFeed', feed);
    });

    socket.on('sendNotification', (data) => {
      Notification.create({
        sender: data.senderId,
        receiver: data.recieverId,
        message: data.message,
        targetId: data.targetId,
        notifyUrl: data.notifyUrl,
        companyId: data.companyId,
        isRead: false,
      }).then(res => {
        Notification.findById({ _id: res._id })
          .populate('sender')
          .populate('receiver')
          .exec((err, notificationRes) => {
            if (err) {
              return emitError(data.senderId, 'Something went wrong', err);
            }
            let socketId = [];
            UserSocketID.find({ userId: data.recieverId }).then(response => {
              if (response && response.length > 0) {
                socketId = response[0].socketId;
              }
              if (socketId.length > 0) {
                socketId.map((element) => {
                  io.to(element).emit('notification', notificationRes);
                });
              }
            });
          });
      }).catch(err => emitError(data.senderId, 'Something went wrong', err));

      // Notification.create({
      //   sender: data.senderId,
      //   receiver: data.recieverId,
      //   message: data.message,
      //   targetId: data.targetId,
      //   notifyUrl: data.notifyUrl,
      //   companyId: data.companyId,
      //   isRead: false,
      // }).then(res => {
      //   Notification.findById({ _id: res._id })
      //     .populate('sender')
      //     .populate('receiver')
      //     .exec((err, notificationRes) => {
      //       if (err) {
      //         return emitError(data.senderId, 'Something went wrong', err);
      //       }
      //       let socketId = [];
      //       const index = userSocketID.findIndex(x => x.userId === data.recieverId);
      //       if (index > -1) {
      //         socketId = userSocketID[index].socketId;
      //       }
      //       if (socketId.length > 0) {
      //         socketId.map((element) => {
      //           io.to(element).emit('notification', notificationRes);
      //         });
      //       }
      //     });
      // }).catch(err => emitError(data.senderId, 'Something went wrong', err));
    });

    socket.on('readNotification', (data) => {
      Notification.findByIdAndUpdate(data.notificationId, { isRead: true }, { new: true })
        .exec((updateErr, updateResponse) => {
          if (updateErr) {
            return emitError(data.userId, 'Something went wrong', updateErr);
          }
          let socketId = [];
          UserSocketID.find({ userId: data.userId }).then(response => {
            if (response && response.length > 0) {
              socketId = response[0].socketId;
            }
            if (socketId.length > 0) {
              socketId.map((element) => {
                io.to(element).emit('readNotification', updateResponse);
              });
            }
          });
        });

      // Notification.findByIdAndUpdate(data.notificationId, { isRead: true }, { new: true })
      //   .exec((updateErr, updateResponse) => {
      //     if (updateErr) {
      //       return emitError(data.userId, 'Something went wrong', updateErr);
      //     }
      //     // io.to(userSocketID[data.userId]).emit('readNotification', updateResponse);
      //     let socketId = [];
      //     const index = userSocketID.findIndex(x => x.userId === data.userId);
      //     if (index > -1) {
      //       socketId = userSocketID[index].socketId;
      //     }
      //     if (socketId.length > 0) {
      //       socketId.map((element) => {
      //         io.to(element).emit('readNotification', updateResponse);
      //       });
      //     }
      //   });
    });

    // socket.on('isAlive', (data) => {
    //   const consultantPing = new ConsultantPing({
    //     consultantId: data.userId,
    //     companyId: data.companyId,
    //     ping: data.ping,
    //     onCall: data.onCall,
    //   });
    //   consultantPing.save(() => {});
    //   ConsultantTimeLog.find({ consultantId: data.userId, companyId: data.companyId }, (consultantTimeError, consultantTimeResponse) => {
    //     if (consultantTimeError) {
    //       return;
    //     }
    //     if (consultantTimeResponse && consultantTimeResponse.length > 0) {
    //       const consultantObject = consultantTimeResponse[0];
    //       if (consultantObject.lastPing && consultantObject.lastPing.length > 2) {
    //         const minuteDiff = Date.diff(new Date(data.ping), new Date(consultantObject.lastPing)).minutes();
    //         if (minuteDiff > 2) {
    //           if (consultantObject.hoursCompleted) {
    //             consultantObject.hoursCompleted += Date.diff(new Date(consultantObject.lastPing), new Date(consultantObject.firstPing)).minutes();
    //           } else {
    //             consultantObject.hoursCompleted = Date.diff(new Date(consultantObject.lastPing), new Date(consultantObject.firstPing)).minutes();
    //           }
    //           consultantObject.firstPing = data.ping;
    //           consultantObject.lastPing = '';
    //         } else {
    //           consultantObject.lastPing = data.ping;
    //         }
    //       } else if (consultantObject.firstPing && consultantObject.firstPing.length > 2) {
    //         const minuteDiff = Date.diff(new Date(data.ping), new Date(consultantObject.firstPing)).minutes();
    //         if (minuteDiff > 2) {
    //           if (consultantObject.hoursCompleted) {
    //             consultantObject.hoursCompleted = Date.diff(new Date(consultantObject.lastPing), new Date(consultantObject.firstPing)).minutes();
    //           } else {
    //             consultantObject.hoursCompleted += Date.diff(new Date(consultantObject.lastPing), new Date(consultantObject.firstPing)).minutes();
    //           }
    //           consultantObject.firstPing = data.ping;
    //           consultantObject.lastPing = '';
    //         } else {
    //           consultantObject.lastPing = data.ping;
    //         }
    //       } else {
    //         consultantObject.firstPing = data.ping;
    //       }
    //       consultantObject.save((timeLogError, timeLogResponse) => {
    //         if (timeLogError) {
    //           return;
    //         }
    //       });
    //     } else {
    //       const consultantTimeLog = new ConsultantTimeLog({
    //         consultantId: data.userId,
    //         companyId: data.companyId,
    //         firstPing: data.ping,
    //       });
    //       consultantTimeLog.save((timeLogError, timeLogResponse) => {
    //         if (timeLogError) {
    //           return;
    //         }
    //       });
    //     }
    //   });
    // });

    socket.on('isAlive', (data) => {
      ConsultantPing.find({ consultantId: data.userId, companyId: data.companyId })
        .sort({ createdAt: -1 })
        .limit(1).then(result => {
          if (result && result.length > 0) {
            if (data.onCall) {
              if (result[0].onCall) {
                const minuteDiff = (new Date(data.ping)).getTime() - (new Date(result[0].ping)).getTime();
                const seconds = (minuteDiff / 1000);
                if (seconds >= 4.9) {
                  savePing(data);
                }
              } else {
                savePing(data);
              }
            } else { // current on call false
              const minuteDiff = (new Date(data.ping)).getTime() - (new Date(result[0].ping)).getTime();
              const seconds = (minuteDiff / 1000);
              if (seconds >= 4.9) {
                savePing(data);
              }
            }
          } else { // no previous data
            savePing(data);
          }
        });
    });

    function savePing(data) {
      const consultantPing = new ConsultantPing({
        consultantId: data.userId,
        companyId: data.companyId,
        ping: data.ping,
        onCall: data.onCall,
      });
      consultantPing.save(() => { });
      ConsultantTimeLog.find({ consultantId: data.userId, companyId: data.companyId }, (consultantTimeError, consultantTimeResponse) => {
        if (consultantTimeError) {
          return;
        }
        if (consultantTimeResponse && consultantTimeResponse.length > 0) {
          const consultantObject = consultantTimeResponse[0];
          if (consultantObject.firstPing && consultantObject.firstPing.length > 2) {
            const minuteDiff = Date.diff(new Date(data.ping), new Date(consultantObject.firstPing)).minutes();
            if (minuteDiff < 2) {
              if (!consultantObject.hoursCompleted) {
                consultantObject.hoursCompleted = Date.diff(new Date(data.ping), new Date(consultantObject.firstPing)).minutes();
              } else {
                consultantObject.hoursCompleted += Date.diff(new Date(data.ping), new Date(consultantObject.firstPing)).minutes();
              }
              consultantObject.firstPing = data.ping;
              consultantObject.lastPing = '';
            } else {
              consultantObject.firstPing = data.ping;
            }
          } else {
            consultantObject.firstPing = data.ping;
          }
          consultantObject.save((timeLogError, timeLogResponse) => {
            if (timeLogError) {
              return;
            }
          });
        } else {
          const consultantTimeLog = new ConsultantTimeLog({
            consultantId: data.userId,
            companyId: data.companyId,
            firstPing: data.ping,
          });
          consultantTimeLog.save((timeLogError, timeLogResponse) => {
            if (timeLogError) {
              return;
            }
          });
        }
      });
    }

    socket.on('isDead', (data) => {
      ConsultantTimeLog.find({ consultantId: data.userId, companyId: data.companyId }, (consultantTimeError, consultantTimeResponse) => {
        if (consultantTimeError) {
          // console.log('isDead-error', consultantTimeError);
          return;
        }
        const consultantObject = consultantTimeResponse[0];
        if (consultantObject.lastPing && consultantObject.lastPing.length > 2) {
          if (consultantObject.hoursCompleted) {
            consultantObject.hoursCompleted += Date.diff(new Date(consultantObject.lastPing), new Date(consultantObject.firstPing)).minutes();
          } else {
            consultantObject.hoursCompleted = Date.diff(new Date(consultantObject.lastPing), new Date(consultantObject.firstPing)).minutes();
          }
          consultantObject.firstPing = '';
          consultantObject.lastPing = '';
        } else {
          consultantObject.firstPing = '';
          consultantObject.lastPing = '';
        }
        // consultantObject.lastPing = data.ping;
        consultantObject.save((timeLogError, timeLogResponse) => {
          if (timeLogError) {
            // console.log('update-error', timeLogError);
            return;
          }
          // console.log('update-response', timeLogResponse);
        });
      });
    });
  });
};
