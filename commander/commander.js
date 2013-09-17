var drone  = require('ar-drone').createClient();
var commandDefaults = {
  'clockwise': [0.1],
  'counterclockwise': [0.1],
  'stop': [],
  'up': [0.1],
  'down': [0.1],
  'front': [0.1],
  'back': [0.1],
  'left': [0.1],
  'right': [0.1],
  'animate': ['flipLeft', 1500],
  'land':[]
}

var commander = {
  init: function (done) {
    drone.takeoff();
    setTimeout(done, 5000);
  },
  exec: function (data) {
    data = data.toLowerCase();
    if(data && data === 'help'){
      return _.keys(commandDefaults);
    }
    var fn = drone[data];
    if(fn){
      return fn.apply(drone, commandDefaults[data]) || "No Reply";
    }
    return "Bad Command"
  }
};

module.exports = commander;