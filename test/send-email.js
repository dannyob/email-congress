var fs = require('fs');
var mailgun = require('mailgun-js')(process.env.MAILGUN_API_KEY,
                                    process.env.MAILGUN_DOMAIN);
var Mustache = require('mustache');

var domesticTemplate = fs.readFileSync('templates/domestic.html', 'utf8');

describe('mailgun', function () {
  it('should send an email', function () {
    var details = {
      user: 'asdas'
    };

    var data = {
      from: 'Excited User <me@samples.mailgun.org>',
      to: process.env.TEST_EMAIL || 'thomasalwyndavis@gmail.com',
      subject: 'Hello',
      text: Mustache.render(domesticTemplate, details)
    };

    mailgun.messages.send(data, function (error, response, body) {
      console.log(body);
    });
  });
});