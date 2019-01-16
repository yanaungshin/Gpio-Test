/**
* five: johnny-five
* pis: Array of strings (Pin number liks 'P1-31', not GPIO number)
* callback: callback function with return value index of pins
# Components
    * Resistor 1k Ohm
    * Push button
# Connect
    * BUTTON (1) - (Any GPIOs)
             (2) - 5V
             (2) - Resistor 1k Ohm - GND
@ needed: sudo
*/
var btnPins = ["P1-11", "P1-13"];
function Buttons(five, pins, callback){
    var buttons = new five.Buttons({
        pins: pins
    });
    buttons.on("press", function(button) {
      console.log(button.pin);
        callback(pins.indexOf(button.pin), button.pin);
    });
    console.log('Buttons ready..');
}
module.exports = Buttons;
