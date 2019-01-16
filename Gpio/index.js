var five = require('johnny-five');
var Raspi = require('raspi-io');

// var config = require('../config');
var Buttons = require('./Buttons');
var Leds = require('./Leds');
var Motor = require('./Motor');

function Gpio(server){
    var self = this;
    var doorDelay =7;

    var board = new five.Board({
        io: new Raspi()
    });


    this.read= function () {
      var rtn = {};
        rtn.Leds = [];
        for(var i=0; i < 8; i++ ){
            rtn.Leds[i] = this.Leds.read(i);
            return rtn;
    };
  };
    board.on('ready', function() {
        self.buttons = new Buttons(five,['P1-11','P1-13'] ,buttonPress)
        self.motor = new Motor(five,fnCallback, {time:4.6});
        self.leds = new Leds(five, ['P1-36','P1-38','P1-40']);
        console.log('GPIO ready!')
    });
    function buttonPress(bIdx, btnNo){
        console.log('button pressed: index - ', bIdx, btnNo)
        if(bIdx<2){
            self.motor.open(bIdx);
           // sockets.emit('alarm',{alarm:true,type:"bell"});
            self.leds.toggle(bIdx);

           console.log('call open btn');
         // For test


    }
  };
    function fnCallback(type, index, value) {
      // if (self.socket) {
      //    self.socket.emit('control', {type:type, idx:index, value:value});
      }

      console.log("servo start ...");

    }

    function close() {
      self.motor.toggle();
    }
  // function btnClick(btnNo){
  //         if(btnNo == 0){
  //           self.leds.toggle(btnNo);
  //             // self.motor.open(doorDelay);
  //             // sockets.emit('alarm',{alarm:true,type:"bell"});
  //             console.log('call open btn');
  //
  //         }else{
  //             self.leds.toggle(btnNo);
  //             // alarm (all lamp blink)
  //             fnCallback('LAMPS', btnNo, self.Leds.read(btnNo));
  //         }
  // };

// };



  // self.socket.emit('init',{ type:'INIT', value:data.falg});
  // Member.findOne({rfid:data.falg},function (err,rtn) {
  //   if(err)throw err;
  //   if(rtn == null){
  //     saveLog("Door",data.type,data.idx, data.falg,"Open door by RFID(Not Register Member)","Client");
  //     self.display.print('You Are Not','Family Member');
  //   }else{
  //     if (rtn.options == "use") {
  //     saveLog("Door",data.type,data.idx, data.falg,"Open door by RFID(Family Member)","Client");
  //       self.display.print('Welcome   ',rtn.name);
  //       self.motor.open(doorDelay);
  //
  //       if(security){
  //         self.socket.emit('control',{type:'SC',value:true});
  //       }
  //
  //     }else {
  //         saveLog("Door",data.type,data.idx, data.falg,"Open door by RFID(Inactive Family Member)","Client");
  //      // saveRfidLog("RFID",rtn.name,data.falg,"Inactive Family Member");
  //       self.display.print('You Are Inactive ','Family Member');
  //     }
  //   }
  // });
module.exports = Gpio;
