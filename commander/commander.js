var _ = require('underscore');
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
  'disableEmergency': [],
  'animate': ['flipLeft', 1500],
  'animateLeds': ['animateLeds', 10, 10],
  'land':[]
}

var commander = {
  init: function (done) {
    drone.takeoff();
    setTimeout(done, 5000);
  },
  exec: function (command) {
    data = command.toString().trim().toLowerCase();
    console.log("processing ", data);
    if(data === 'help'){
      console.log("sending", _.keys(commandDefaults));
      return _.keys(commandDefaults).join('\n')+ '\n';
    }
    var fn = drone[command.toString().trim()] || drone[data];
    if(fn){
      var resData = fn.apply(drone, commandDefaults[data]) || "No Reply";
      console.log(resData.toString()+'\n');
      return resData.toString()+'\n';
    }
    console.log('bad command');
    return "Bad Command\n"
  }
};

module.exports = commander;