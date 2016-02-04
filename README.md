# Coffee Bot

**Disclaimer**

*I am not a trained electrician or electrical engineer.  Please be super careful and thoroughly understand the risks you are taking when working with electronics, especially 120 volts when working with wall-powered appliances.  Kettles and other heating elements that can be left on when your Pi or code fails can obviously be __very dangerous__. I am not responsible for any mishaps or injuries.  I suggest you keep your wall appliances plugged into a separate multi-outlet extension from your Pi (that needs to stay on) so you can easily determine whether or not there is 120V in your creation while testing.  __Never__ work with any electronics that are powered.*

**Background**

For years I have wanted to automate the process of making coffee in the morning.  I love drinking coffee but despise making it every morning.  It's literally the worst time to have to do complete a bunch of processes just to get going.  Especially when the process takes ten minutes and requires multiple steps to complete. The problem is similar to getting a car empty of gas to a gas station.

Most ways of making coffee require at least five steps:

- Get the coffee, grind it
- When it's good coffee, weigh it
- Get a filter or retrieve your French Press
- Heat and/or add water to the machine
- Turn on the coffee machine
- Wait four to five minutes

That sucks!

So as part of my career transition from finance to technology, I asked for a Raspberry Pi for Christmas to work on projects.  I got one.  A [Raspberry PI 2 Model B](https://www.raspberrypi.org/products/raspberry-pi-2-model-b/), which is super powerful.  Then I started dreaming of all the things I could make with it.  Turns out you can make basically anything.  Pis run Linux, which means you can run many apps and seemingly every computer on them.  Awesome. 

So after a week of owning a Raspberry Pi and pondering what I could do with it, the idea of making a coffee maker came back to mind.  It was definitely the idea I was most passionate about.  It was also something I would use every day.  Something that would save me ten minutes every day.  So it would pay off.  Could I actually make a coffee machine?  What would I have to accomplish?  What parts do I need?  How many different components would it need?  What language would I write it in?

**Design Goals**

There were three main goals I was looking to achieve:
- Reduce the number of steps required to make coffee
- Eliminate the wait time of ~10 minutes
- Minimize the frequency of water and coffee refills

**Parts**

Below are the most salient parts if you want to build your own or something similar.  

- [The Raspberry Pi itself](http://www.amazon.com/CanaKit-Raspberry-Complete-Starter-9-Items/dp/B008XVAVAW/)
- [A 2.5 gallon aquarium like this one](http://www.amazon.com/All-Glass-Aquarium-AAG10002-2-5-Gallon/dp/B0002AS1PE/) These will hold approximately 28 300 gram servings of water.  
- 1"*8"*8' wood
- [A four channel relay](http://amzn.com/B00KTEN3TM)
- [Bunches of wires](http://www.amazon.com/Kalevel%C2%AE-120pcs-Multicolored-Female-Breadboard/)
- [This burr coffee grinder](http://amzn.com/B004T6EJS0)
- [Wire connectors for the appliances](http://www.amazon.com/gp/product/B004X32N5U)
- [This is the cold water pump.  From the aquarium to the kettle](http://www.amazon.com/gp/product/B0018WVNX2)
- [14 gauge wire for the wall appliances](http://www.amazon.com/Grand-General-55241-14-Gauge-Primary/)
- [Power supply for the 12V hot water pump](http://www.amazon.com/JBtek-Breadboard-Supply-Arduino-Solderless/dp/B010UJFVTU)

**Other Electronics Items You Probably Want to Own**
- [Alligator wires for testing circuits](http://www.amazon.com/gp/product/B0002KRABU)
- [A multimeter also for testing circuits](http://www.amazon.com/Etekcity-Digital-Multimeter-Tester-Measurement/dp/B00B7CS3UY)
- [Breadboards](http://www.amazon.com/Frentaly%C2%AE-Solderless-BreadBoard-tie-points-power/dp/B01258UZMC)


