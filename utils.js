export function getAmountOfHands(frame){
    return handsPresent(frame) ? frame.hands.length : 0; 
}

export function handsPresent(frame){
    return frame.hands.length ? true : false ; 
}

export function getMeanPosition(frame){
    if(!handsPresent(frame))
        return; 

    const hands = frame.hands; 

    let meanPosition = Leap.vec3.fromValues(0, 0, 0); 
    let i = 0; 
    for(let hand of hands){
        Leap.vec3.add(meanPosition, hand.palmPosition, meanPosition); 
        i+= 1; 
    }

    Leap.vec3.scale(meanPosition, meanPosition, 1/i); 
    console.log(meanPosition); 
}