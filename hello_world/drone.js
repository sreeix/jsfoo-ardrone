var droneClient = require('ar-drone').createClient();
var _ = require('underscore');

var droneMock = {
  front: _.partial(console.log,'Front'),
  stop: _.partial(console.log,'Stopping'),
  clockwise: _.partial(console.log,'clockwise'),
  clockwise: _.partial(console.log,'clockwise'),
  land: _.partial(console.log,'landing'),
  on : _.partial(console.log, 'On listener'),
  takeoff: _.partial(console.log, 'Taking off')
};

// droneClient = droneMock;

var stopAndCallback = function (cb) {
  return function (argument) {
    droneClient.stop();
    console.log("stopped now calling the done function");
    setTimeout(cb, 1000);
  }
};

var drone = {
  x : 0, y : 0,
  init: function init (cb) {
    droneClient.ftrim();
    droneClient.config('general:navdata_data_demo', false);
    droneClient.config('control:outdoor', false); // This is not outdoor. 
    droneClient.config('control:flight_without_shell', false); // Using the shell all the time
    droneClient.takeoff();
    console.log('taking off');
    setTimeout(cb, 5000);
    return drone
  },
  on: function(event, fn){
    var throttled = _.throttle(fn);
    droneClient.on(event, function (data) {
      drone.currentData = data;
      console.log("Battery: ",data.demo.batteryPercentage);
      if(data.demo && (data.demo.controlState === 'CTRL_HOVERING' ||data.demo.controlState === 'CTRL_FLYING')){
        return throttled(data, 10);
      }
    });
  },
  forward: function forwardMaker(units) {
    return function forward(cb) {
      console.log("Going front.", "for", units * 100, 'ms')
      droneClient.front(0.1);
      setTimeout(stopAndCallback(cb), units * 100 );
      return drone;
    }
  },
  turn: function turnMaker (angle) {
    return function turn(cb) {
      console.log("Turning at.", angle, "rotating for ", angle * 10, 'ms');
      var startData = drone.currentData.demo.clockwiseDegrees;
      console.log("Current Angle is ", startData);
      droneClient.clockwise(0.20);
      setTimeout(stopAndCallback(function() {
        console.log(drone.currentData.demo.clockwiseDegrees, "change", drone.currentData.demo.clockwiseDegrees - startData);
        cb();
      }), angle * 10);
      return drone;
    }
  },
  penDown: function penDown(cb) {
    return drone;
  },
  reset: function reset (cb) {
    cb();
    return drone;
  },
  shutdown: function shutdown (cb) {
    droneClient.land();
    setTimeout(cb, 100);
  }
};

drone.right = _.partial(drone.turn, 90)();
drone.left = _.partial(drone.turn, 270)();
drone.back = _.partial(drone.turn, 180)();

module.exports = drone;