# Coffee Bot

**Disclaimer**

*I am not a trained electrician or electrical engineer.  Please be super careful and thoroughly understand the risks you are taking when working with electronics, especially 120 volts when working with wall-powered appliances.  Kettles and other heating elements that can be left on when your Pi or code fails can obviously be __very dangerous__. I am not responsible for any mishaps or injuries.  __Never__ work with any electronics that are powered.*

**Background**

For years I have wanted to automate the process of making coffee in the morning.  I love drinking coffee but despise making it every morning.  It's literally the worst time to have to do complete a bunch of processes just to get going.  Especially when the process takes ten minutes and requires multiple steps to complete. The problem is similar to getting a car empty of gas to a gas station.

Most ways of making coffee require at least five steps depending on whether you're using a French Press (obviously the best way) or not:

1. Weigh the coffee
2. Grind the coffee
3. Add the filter
4. Heat water
5. Pour the water
6. Wait four minutes

So as part of my career transition from finance to technology, I asked for a Raspberry Pi for Christmas to work on projects.  I got one.  A [Raspberry PI 2 Model B](https://www.raspberrypi.org/products/raspberry-pi-2-model-b/), which is super powerful.  Then I started dreaming of all the things I could make with it.  Turns out you can make basically anything.  Raspberry Pis run Linux, which means you can run many apps and seemingly every computer language on them.  Awesome. 

So after a week of owning a Raspberry Pi and pondering what I could do with it, the idea of making a coffee maker came back to mind.  It was definitely the idea I was most passionate about.  It was also something I would use every day.  Something that would save me ten minutes every day.  So it would pay off.  Could I actually make a coffee machine?  What would I have to accomplish?  What parts do I need?  How many different components would it need?  What language would I write it in?

**What's Included in this Readme**

This readme does not enumerate the steps to make this.  I merely list the most important parts and have included the code as well.  I also will provide you with some information that is non-obvious from the pictures and parts.  Especially about stuff that took a while to figure out, such as what materials to use for the hot-water-pumping part.  It turns out that drinking coffee made from water that has flowed through molten PVC does not taste so hot.  And I'm guessing my future kids would prefer to have four limbs instead of five, if you know what I mean.

So I'm providing the building blocks that should make it possible to build this or something similar.  The tweaking, testing and fitting together are some of the funnest parts of building things, so I leave those to you.

**Design Goals**

There were three main goals I was looking to achieve:
- Reduce the number of steps required to make coffee
- Eliminate the wait time of ~10 minutes
- Minimize the frequency of water and coffee refills

**Parts**

Below are the most salient parts if you want to build your own or something similar.  

- [The Raspberry Pi itself](http://www.amazon.com/CanaKit-Raspberry-Complete-Starter-9-Items/dp/B008XVAVAW/)
- [A 2.5 gallon aquarium like this one](http://www.amazon.com/All-Glass-Aquarium-AAG10002-2-5-Gallon/dp/B0002AS1PE/) These will hold approximately 28 300 gram servings of coffee/water.  
- 1" * 8" * 8' wood
- [A four channel relay](http://amzn.com/B00KTEN3TM)
- [Bunches of wires](http://www.amazon.com/Kalevel%C2%AE-120pcs-Multicolored-Female-Breadboard/)
- [This burr coffee grinder](http://amzn.com/B004T6EJS0)
- [Wire connectors for the appliances](http://www.amazon.com/gp/product/B004X32N5U)
- [This is the cold water pump: from the aquarium to the kettle](http://www.amazon.com/gp/product/B0018WVNX2)
- [The hot water pump](http://www.amazon.com/gp/product/B0196WL6GY)
- [14 gauge wire for the wall appliances](http://www.amazon.com/Grand-General-55241-14-Gauge-Primary/)
- [Power supply for the 12V hot water pump](http://www.amazon.com/JBtek-Breadboard-Supply-Arduino-Solderless/dp/B010UJFVTU)

**Other Parts You Probably Want to Own**
- [Alligator wires for testing circuits](http://www.amazon.com/gp/product/B0002KRABU)
- [A multimeter also for testing circuits](http://www.amazon.com/Etekcity-Digital-Multimeter-Tester-Measurement/dp/B00B7CS3UY)
- [Breadboards](http://www.amazon.com/Frentaly%C2%AE-Solderless-BreadBoard-tie-points-power/dp/B01258UZMC)
- [Assorted screws](http://www.amazon.com/Hillman-Group-591519-Assortment-195-Pack/dp/B00CR8ZRE2)

**Code**

- The Coffee Bot runs a Node.js & Express server.  All it does is run a series of functions in a row: pump cold water for *s* seconds; heat that water for *x* seconds; grind coffee for *z* seconds; and finally pump the heated water into the French Press.
- It uses [Async's](https://github.com/caolan/async) handy [series](https://github.com/caolan/async#seriestasks-callback) control flow.  You simply create an array (or object) of functions that run in order, or in series.
- If you've never written code that alters physical space, I suggest you try it sometime.  Even getting software to stop and start a motor was exhilirating for me.
- The [final function] in the code is an important one.  It turns everything off.

**Tips and Takeaways**

- Say you're build something with two wall appliances.  Get a separate multi-outlet extension that has only the wall appliances plugged into it.  You'll be able to easily determine whether or not 120V is flowing through your application and unplug it while debugging and testing.
- **Relays**  
  - The relays may be the most important part of this whole project.  They are the switches, essentially, that allow us to turn off and on electronic components that otherwise use too much power for the Raspberry Pi.  
  - The high power components bust be electrically isolated from the Pi.  The Pi must be insulated from the 8 amps of current the hot water kettle draws.  
  - The relays, called [Opto-Isolators](https://en.wikipedia.org/wiki/Opto-isolator), operate like two light houses.  When light from one is shining, the other sees that light and connects electricity on its end.
  - The center terminal is the hot/positive/ terminal.  Why are there _two_ other terminals?  One is normally open, or off.  The other is normally closed or on.  This is actually indicated on the relay.  See the white lines in the foreground?  On the left side, the line does not connect with the center terminal.  On the right side the line connects.  This is your hint.  For wall appliances, you almost certainly want normally off or else they will run while your Pi is booting or has crashed.  Not good.

    <img src="https://github.com/JohnAllen/coffee-bot/blob/master/relay-closeup.png" alt="relay closeup" width="150px" height="150px">
- I found the same aquarium from Petsmart for ~$13, not $30+ on Amazon.
- 


