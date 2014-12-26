=======
edyplug.js
==========

node.js module for ediplug control

Written by Wouter van der Rijst.

## Install
Get source from github and unzip in target directory

## Switch to plug:
`````javascript
	var smartplug = require('./ediplug');

        var plug = new smartplug({name:'livingroom light', address:'192.168.1.101'});
        // get status of the ediplug
        plug.probe( function(p) { 
          console.log(p.name + ' is ' + p.state); 
        });

        // get toggle state of the ediplug
        plug.probe( function(p0) {
          p0.switch( function(p1) { 
            console.log(p1.name + ' is switched ' + p1.state); 
          });
        });
          
`````
-->
    livingroom light is OFF
    livingroom light is switched ON
