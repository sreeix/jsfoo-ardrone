
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , _ = require('underscore')
  , drone = require('./drone');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app);
var io = require('socket.io').listen(server)

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

drone.on('navdata', function (data) {
  var droneData = {flying: data.droneState.flying, 
    altitude: data.demo.altitude, 
    state: data.demo.controlState,
    batteryPercentage: data.demo.batteryPercentage, 
    rotation: _.pick(data.demo.rotation,'frontBack', 'pitch', 'yaw', 'theta', 'roll', 'clockwise'),
    velocity: data.demo.velocity,
    clockwiseDegrees: data.demo.clockwiseDegrees
  };
  console.log("-------------------------");
  console.log(droneData);
  console.log("-------------------------");

  io.sockets.emit("update", droneData);
})
// io.sockets.on('connection', function (socket) {
//   socket.emit('news', { hello: 'world' });
//   socket.on('my other event', function (data) {
//     console.log(data);
//   });
// });