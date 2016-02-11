var wpi = require('wiring-pi');
wpi.setup('wpi'); // Configure pins to wiringPi mode

var async = require('async');
var connect = require('connect');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser').json();

var app = connect();
app.use(bodyParser);

turnOn = function (device) { wpi.digitalWrite(device, 0);};
turnOff = function (device) { wpi.digitalWrite(device, 1);};  // Relays are normally open or off. 

makeCoffee = function (numCups, testing) {
  async.series({
    runSetup: function (callback) {
      console.log("Setting device pin modes and seconds per cup");

      // Hardware time constants.  How long do we run each appliance per cup of coffee?
      if (testing) {
        console.log('TESTING: Setting device secs/timer to two seconds each because TESTING');
        coldWaterSecsCup = 2;    // number of secs per cup passed from user to pump water into hot water kettle
        heatTimePerCup = 2;  // number of seconds hot water kettle must be on to heat each cup of water.  Assumed to be linear at this time (1-10-2016)
        hotWaterPumpSecsCup = 2;    // number of seconds to pump heater water from kettle to coffee brewing apparatus
        grindTimePerCup = 2;   // number of seconds grinder needs to grind 20 grams, or one cup worth of coffee
      } else {
        console.log('PRODUCTION: we are in production. ');
        console.log('Don\'t forget to add testing as a command line arg if testing');
        coldWaterSecsCup = 4.22;    // How long to pump coldwater into kettle per cup.  300 gram cups; approx 71 grams of water per sec.  
        heatTimePerCup = 180 + (numCups * 55) + 60;  // number of seconds hot water kettle must be on to heat water.
        // ^ Add 60 seconds for coffee sitting at top of French Press water
        hotWaterPumpSecsCup = 10;    // number of seconds to pump heater water from kettle to coffee brewing apparatus
        grindTimePerCup = 20 / 1.5;   // grams per cup divided by grams ground per second
      }
      // Setup pins for wiring-pi library
      coldWaterPump = 0;  // pin for cold water aquarium pump off/on
      kettle = 2;         // pin that turns hot water kettle off/on
      grinder = 3;        // pin that turns on power to grinder
      grinderRelay = 5;   // Extra relay for grinder relay.  Must turn this on then off for internal grinder logic to run 
      hotWaterPump = 4;   // pin that turns on pump that pumps water from hot water kettle to French Press

      // Pin modes - pumps and kettle are outs
      // Each wpi.digitalWrite ensures appliances are off at startup
      wpi.pinMode(coldWaterPump, wpi.OUTPUT); // pin for coldwater pump
      wpi.digitalWrite(coldWaterPump, 1);

      wpi.pinMode(kettle, wpi.OUTPUT);        // pin for kettle off/on
      wpi.digitalWrite(kettle, 1);

      wpi.pinMode(grinder, wpi.OUTPUT);       // pin for kettle off/on
      wpi.digitalWrite(grinder, 1);

      wpi.pinMode(hotWaterPump, wpi.OUTPUT);  // pin for hot water pump
      wpi.digitalWrite(hotWaterPump, 1);

      wpi.pinMode(grinderRelay, wpi.OUTPUT);  // Extra pin & relay for grinder switch
      wpi.digitalWrite(grinderRelay, 1);

      callback();
    },
    pumpColdWater: function (callback) {
      console.log('Pumping cold water into kettle');
      turnOn(coldWaterPump);
      setTimeout(function () {
        console.log('Turning off cold water pump');
        turnOff(coldWaterPump);
        callback(null);
      }, coldWaterSecsCup * 1000 * numCups);
    },
    heatWater: function (callback) {
      turnOn(kettle);
      setTimeout(function () {
        console.log('Turning kettle off');
        turnOff(kettle);
        callback(null);
      }, heatTimePerCup * 1000 * numCups);
    },
    grindCoffee: function (callback) {
      console.log('Turning on grinder');
      turnOn(grinder);  //  Power for grinder.  Grinder does not turn on at this time.  Must turn on & off extra relay below
    
      //  Delay for extra grinder relay operations//  Delay for extra grinder relay operations
      setTimeout(function () {
        console.log('Turning off grinder');
        turnOn(grinderRelay);
      }, 400);

      setTimeout(function () {
        console.log('Turning off grinderRelay');
        turnOff(grinderRelay);
      }, 800);

      setTimeout(function () {
        console.log('Turning off grinder');
        turnOff(grinder);
        callback(null);
      }, 1000 + grindTimePerCup * 1000 * numCups);  //  Extra 1000 ms to ensure too dark and not too light
    },
    pumpHotWater: function (callback) {
      turnOn(hotWaterPump);
      setTimeout(function () {
        turnOff(hotWaterPump);
        callback(null);
      }, hotWaterPumpSecsCup * 1000 * numCups);
    },
    turnEverythingOff: function (callback) {
      [0, 2, 3, 4, 5].forEach(function (pin) {
        console.log("Turning pin: %s off", pin);
        wpi.digitalWrite(pin, 1);
      });
    }
  });
};

// Check if testing mode.  Pass extra command line "testing" for testing mode.
testing = false;
if (process.argv[2] === 'testing') {
  testing = true;
}

app.use('/cups', function cupsMiddleware(req, res, next) {
  if (req.body.cups)
    var numCups = parseInt(req.body.cups);
  else throw new Error('No numCups passed');
  makeCoffee(numCups, testing);
});

app.use(serveStatic(__dirname, {'index': ['coffee.html']}));
console.log('Coffee Bot server started. Ready to brew.');
app.listen(8080);
