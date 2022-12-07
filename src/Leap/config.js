// Leap Motion 
import * as Leap from 'leapjs'; 
export function LeapConfig(controller){
    
    // controller.Loop(() 0)
    controller.connect();
    controller.setBackground(true);

    attachListeners(controller); 
}


function attachListeners(controller){

    controller.on('streamingStarted', (frame) => {
        console.log('Leap Motion Connected'); 
    }); 

    controller.on('streamingStopped', (frame) => {
        console.log('Leap Motion Disconnected/Paused'); 
    }); 
}