var Nightmare = require('nightmare');
var vo = require('vo');

const profiles = [];

vo(function* () {
  var nm = Nightmare({show: true});
  nm
    .goto('http://github-awards.com/users?utf8=%E2%9C%93&type=city&language=javascript&city=Minsk');

  yield nm.end();
})(function(err, result) {
  if(err) {
    return console.log(err);
  }
  console.log(result)
});

