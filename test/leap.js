// const leap = require('leapjs'); 

console.log("Leap Script Done")

// Leap motion main loop
Leap.loop((frame) => {
    const output = document.getElementById('output');
    console.log(output)
    console.log(frame); 
    output.innerHTML = 'Frame: ' + frame.id;
});