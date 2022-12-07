# Handysion 
_HandTracking Sensor Fusion System_

Handysion, is a JS Leap Motion Sensor Fusion, using Mediapipe Hand tracking system to expand the possible hand gestures. It allows to identify overlaping complex hand positions impossible to detect only with the Leap motion (LM) system. It basically takes the computer's frontal camera, to __estimate__ the hand key points distribution, and fuse them with the LM data. 

> This repository includes the documentation, and source code for Handysion, our __Sensors and Actuator Final Project__ at Universidad Nacional de Colombia - Sede Bogotá 

## Startup-Guide 
To begin using Handyion, clone the repository and install the JS dependencies. At project root, run: 
```
$ npm install
```
To run the dev server, run
```
$ npm run start 
```

## Understanding the code 
Basically, we are making a sensor fusion routine, with both datasets; LeapMotions and Hand Mediapipe Hand models. What is the problem we are trying to solve? Whe 
### Leap Motion 
### Mediapipe 


## Implementation 
The base web app is build on ReactJS, a frontend JS framework. It allows us to bundle all the dependencies in a depmap, avoiding comple imports for separate source codes.


## Sources 
* Mediapipe: https://google.github.io/mediapipe/solutions/hands
* LeapMotion: https://www.ultraleap.com




### Authors
- Valentina Hernández Montes (vahernandezmo@unal.edu.co)
- Andrés Mauricio Morales Martínez (amoralesma@unal.edu.co)
