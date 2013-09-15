var d = require('./drone');
var _ = require('underscore');
var async = require('async');

var charStructures = {
  // "A":[reset, moveTo(5,10), moveTo(10,0), penUp, moveTo(8, 3), penDown, moveTo(2, 3) ],
  "J":[d.reset, d.right, d.forward(5), d.left, d.forward(10)],
  "S":[d.reset, d.right, d.forward(5), d.left, d.forward(2), d.left, d.forward(5), d.right, d.forward(4), d.right, d.forward(5)]
};

var renderer = {
  draw: function (word, cb) {
    async.eachSeries(_.toArray(word), renderer.drawChar, cb);
  },
  drawChar: function (ch, done) {
    var execFuns = charStructures[ch];
    console.log("--------------------");
    console.log("Drawing Char", ch);
    console.log("--------------------");

    if(execFuns){
      async.eachSeries(execFuns, function (fun, cb) {
        console.log("-- applying ", fun.name);
        fun.apply(d, [function (err, res) {
          console.log("-- Function Applied:", fun.name);
          return cb(err, res);
        }]);
      }, done);
    } else {
      console.log("Character not found", ch)
    }
  }
};

d.init(function () {
  console.time("Drawing");
  renderer.draw('J', function (err, res) {
    console.timeEnd("Drawing");
  });
});
d.on('navdata', function (data) {
  console.log('.');
})
setTimeout(function () {
  d.shutdown();
  process.exit(0);
}, 15000);
