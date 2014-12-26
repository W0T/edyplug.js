var fs = require('fs');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
var http = require('http');

module.exports = function(args) {
  this.name = args.name;
  this.address = args.address;
  this.username = args.login ? args.login : 'admin';
  this.password = args.passwd ? args.passwd : '1234';

  var self = this;

  this.send = function(xmlMessage, callback) {
    var post_data = {
      data: xmlMessage
    };

    var auth = "Basic " + new Buffer(self.username + ":" + self.password)
      .toString("base64");

    var options = {
        host: self.address,
        port: 10000,
        path: 'smartplug.cgi',
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
            'Content-Length': xmlMessage.length,
            'Authorization' : auth
        }
    };

    var postReq = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (result) {
          var doc = new dom().parseFromString(result, 'text/xml');
          
          callback(doc);
        });
    }).on('error', function(e) {
       console.log('Error:' + 'Host ' + self.address + ' ' + e.errno);
    });

    postReq.write(xmlMessage);
    postReq.end();

  }

  this.probe = function( callback ) {
    var filename = '../../ediplug_w0T/status.xml'; 
    var xml = fs.readFileSync(filename); 
    this.send(xml, function(domDoc) {
      self.state = xpath.select("//Device.System.Power.State/text()", domDoc).toString();
      if( callback ) {
        callback(self);
      }
    });
  }

  this.click = function( callback ) {
    switch(this.state) {
      case 'OFF' :
        var filename = '../../ediplug_w0T/on.xml'; 
        break;
      case 'ON' :
      default :
        var filename = '../../ediplug_w0T/off.xml'; 
        break;
    }
    var xml = fs.readFileSync(filename); 
    this.send(xml, function(domDoc) {
      if ('OK' != xpath.select("//CMD/text()", domDoc).toString() ) {
        console.log('Error while switching plug.');
        return;
      }
      self.state = self.state=='ON' ? 'OFF' : 'ON';

      if( callback ) {
        callback(self);
      }
    });
  }

  this.getStatus = function() {
    return this.status;
  }

  this.probe(); 

}
