var smartplug = require('./ediplug.js')
, assert = require('assert');

module.exports = {
	'api': function(test) {
		assert.ok(smartplug.probe, 'probe api ok.');
		assert.ok(smartplug.click, 'click api ok.');
		test.done();
	},

	'probe': function(test) {
                var plug = new smartplug({name : 'sw00', address : '192.168.4.110'});
		assert.equal('sw00', plug.name);
                plug.probe( function(p0) {
                  assert(['ON','OFF'].indexOf(p0.state) );
                });
		test.done();
	},

	'switch': function(test) {
                var plug = new smartplug({name : 'sw00', address : '192.168.4.110'});
                plug.switch( function(p0) {
                  assert(['ON','OFF'].indexOf(p0.state) );
                });
		test.done();
	},

}
