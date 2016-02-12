var Nightmare = require('nightmare');
var vo = require('vo');

var nm = Nightmare({show: true});
const initialUrl = 'http://github-awards.com/users?utf8=%E2%9C%93&type=city&language=javascript&city=San+francisco';
var profiles = [];

vo(function* () {
  var hasNextPage;
  var pageProfiles;
   yield nm.goto(initialUrl);

  do {
    pageProfiles = yield nm
      .evaluate(function() {
        return [].map.call(document.querySelectorAll('td.username a'), (item) => item.text);
      });
    var currentUrl = yield nm.url();

    console.log(`${currentUrl} ${pageProfiles.length}`);
    profiles = profiles.concat(pageProfiles);
    yield nm
      .scrollTo(9999, 0)
      .click('a[rel="next"]')
      .wait(1000);

    hasNextPage = yield nm.exists('a[rel="next"]');
  } while(hasNextPage);

  yield nm.end();
})(function(err, result) {
  if(err) {
    return console.log(err);
  }
  console.log(result);
  console.log(profiles.join('\n'));
});

