var Nightmare = require('nightmare');
var vo = require('vo');

var nm = Nightmare({ show: true });
const initialUrl = 'http://github-awards.com/users?utf8=%E2%9C%93&type=city&language=objective-c&city=Minsk';
var profiles = [];
var emails = [];

vo(function* () {
  var hasNextPage;
  var pageProfiles;
  var name;
  var email;
  yield nm.goto(initialUrl);

  do {
    pageProfiles = yield nm
      .evaluate(function() {
        return [].map.call(document.querySelectorAll('td.username a'), (item) => item.text);
      });
    var currentUrl = yield nm.url();

    console.log(`${currentUrl} ${pageProfiles.length}`);
    profiles = profiles.concat(pageProfiles);

    hasNextPage = yield nm.exists('a[rel="next"]');
    if (hasNextPage) {
      yield nm
        .scrollTo(9999, 0)
        .click('a[rel="next"]')
        .wait(1000);
    }
  } while (hasNextPage);

  for (var i = 0; i <= profiles.length; i++) {
    var item = profiles[i] || 'vvscode';
    yield nm.goto(`http://github.com/${item}`);
    email = yield nm.evaluate(function() {
      return (document.querySelector('.email') || { text: '' }).text;
    });
    name = yield nm.evaluate(function() {
      return (document.querySelector('.vcard-fullname') || { innerHTML: '' }).innerHTML;
    });
    if (email) {
      emails.push(`${name} (${item});${email}`);
    }
  }

  yield nm.end();
})(function(err, result) {
  if (err) {
    return console.log(err);
  }
  //console.log(result);
  //console.log(profiles.join('\n'));
  console.log(emails.join('\n'));
});

