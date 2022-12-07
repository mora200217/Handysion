
import { getAmountOfHands, getMeanPosition, handsPresent } from './utils.js';

// Leap Motion 
var controller = Leap.loop( frame => frameFunction(frame))
// controller.Loop(() 0)
controller.connect();
controller.setBackground(true);

console.log(controller); 

// Functions 
function frameFunction(frame){
//     console.log(`There are: ${getAmountOfHands(frame)}`); 
    if(!handsPresent(frame))
        return; 

    let pos = getMeanPosition(frame); 
    
}

// Listener 
controller.on('streamingStarted', (frame) => {
    console.log('Leap Motion Connected'); 
}); 

controller.on('streamingStopped', (frame) => {
    console.log('Leap Motion Disconnected/Paused'); 
}); 