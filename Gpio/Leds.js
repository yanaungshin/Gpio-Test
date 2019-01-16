/**
* five: johnny-five
* pis: Array of strings (Pin number liks 'P1-31', not GPIO number)
# Components
    * Resistor 86 Ohm
    * LED
# Connect
    * LED (+) - (Any GPIO)
          (-) - Resistor - GND
@ needed: sudo
*/
// var btnPins = ["P1-36", "P1-38","P1-40"];
function Buttons(five, pins){
    var leds = new five.Leds(pins);

    console.log('LEDs ready..');

    this.on = function(bIdx){
        leds[bIdx].on();
    }
    this.off = function(bIdx){
        leds[bIdx].off();
    }
    this.toggle = function(bIdx){

      leds[bIdx].toggle();
    }
}
module.exports = Buttons;
