var async = require('async');
var wpi = require('wiring-pi');
wpi.setup('wpi');

var connect = require('connect');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser').json();

var app = connect();
app.use(bodyParser);

turnOn  = function (device) {wpi.digitalWrite(device, 0);}
turnOff = function (device) {wpi.digitalWrite(device, 1);}

makeCoffee = function (numCups, testing) {

  async.series({
    runSetup: function(callback) {
			
			console.log("Setting pin modes and seconds");
			// Hardware time constants.  How long do we run each appliance per cup of coffee.
			if (testing) {
			  console.log('Setting device secs/timer to two seconds each because in TESTING mode');
			  coldWaterSecsCup     = 2;    // number of secs per cup passed from user to pump water into hot water kettle
			  heatTimePerCup       = 2;  // number of seconds hot water kettle must be on to heat each cup of water.  Assumed to be linear at this time (1-10-2016)
			  hotWaterPumpSecsCup  = 2;    // number of seconds to pump heater water from kettle to coffee brewing apparatus
			  grindTimePerCup      = 2;   // number of seconds grinder needs to grind 20 grams, or one cup worth of coffee
			} else {
			  coldWaterSecsCup     = 4.5;    // number of secs per cup passed from user to pump water into hot water kettle
			  heatTimePerCup       = 180;  // number of seconds hot water kettle must be on to heat each cup of water.  Assumed to be linear at this time (1-10-2016)
			  hotWaterPumpSecsCup  = 10;    // number of seconds to pump heater water from kettle to coffee brewing apparatus
			  grindTimePerCup      = 4;   // number of seconds grinder needs to grind 20 grams, or one cup worth of coffee
			}
			// Setup pins for wiringPi(Python)/wiring-pi(npm) library
			coldWaterPump = 0;  // pin that switches cold water pump off/on
			kettle        = 2;  // pin that turns hot water kettle off/on
			grinder       = 3;  // pin that turns on grinder
			grinderRelay  = 5;
			hotWaterPump  = 4;  // pin that turns on pump that pumps water from hot water kettle to coffee devicePump
			
			// Pin modes - pumps and kettle are outs.  Sensors are in.
			// Immediately set pins to 1 to stop the devices after OUTPUT mode is set
			wpi.pinMode(coldWaterPump, wpi.OUTPUT); // pin for coldwater pump
			wpi.digitalWrite(coldWaterPump, 1);
			
			wpi.pinMode(kettle, wpi.OUTPUT);    // pin for kettle off/on
			wpi.digitalWrite(kettle, 1);
			
			wpi.pinMode(grinder, wpi.OUTPUT);    // pin for kettle off/on
			wpi.digitalWrite(grinder, 1);
			
			wpi.pinMode(hotWaterPump, wpi.OUTPUT);  // pin for hot water pump
			wpi.digitalWrite(hotWaterPump, 1);
			
			wpi.pinMode(grinderRelay, wpi.OUTPUT);
			wpi.digitalWrite(grinderRelay, 1);
			
			callback();
		},
		pumpColdWater: function(callback) {
			console.log('Pumping cold water');
			turnOn(coldWaterPump);
			setTimeout(function () {
  			  console.log('Turning off cold water pump');
			  turnOff(coldWaterPump);
				callback(null);
			}, coldWaterSecsCup * 1000 * numCups);
		},
		heatWater: function(callback) {
			console.log('Turning OFF SECOND/YELLOW light');
			turnOn(kettle);
			setTimeout(function () {
                          console.log('Turning OFF kettle');
			  turnOff(kettle);
			  callback(null);
			}, heatTimePerCup * 1000 * numCups);
		},
		grindCoffee: function (callback) {
			console.log('Turning on GRINDER');
   	 		turnOn(grinder);  			
			setTimeout(function () {
			  console.log('Turning on grinderRelay');
			  turnOn(grinderRelay);  			
			}, 400);

			setTimeout(function () {
			console.log('Turning OFF grinderRelay');
                	  turnOff(grinderRelay);
			}, 800);

			setTimeout(function () {
  			  console.log('Turning off grinder');
			  turnOff(grinder);
			  callback(null);
			}, 1000 + grindTimePerCup * 1000 * numCups);
		},
		pumpHotWater: function(callback) {
			console.log('Turning on THIRD/RED light');
			turnOn(hotWaterPump);
			setTimeout(function () {
			  console.log('Turning OFF THIRD/RED light');
			  turnOff(hotWaterPump);
			  callback(null);
			}, hotWaterPumpSecsCup * 1000 * numCups);
		},
		turnEverythingOff: function (callback) {
		  [0,2,3,4,5].forEach(function(pin) {
		    console.log("Turning pin: %s off", pin); 
		    wpi.digitalWrite(pin, 1);
		  });		    
		}
	});

}

count = 0;

testing = false;
if (process.argv[2] === 'testing') {
  testing = true;
  console.log('TESTING mode');
}



app.use('/cups', function cupsMiddleware(req, res, next) {

	if (req.body.cups)  var numCups = parseInt(req.body.cups);
	else throw new Error('No numCups passed');
	count++;
	console.log("Exress app.use has run %s time", count); 

	makeCoffee(numCups, testing);
	res.redirect('/coffee.html');

});


app.use(serveStatic(__dirname, {'index': ['coffee.html']}));
console.log('Coffee Bot server started. Ready to brew');
app.listen(8080);
