// main js
import * as THREE from 'three'

import  { createBaseGrid }  from "./GUI/grid.js";
import { createCube } from './GUI/orientationCube.js';
import { LeapConfig } from "./Leap/config.js";
import { getAmountOfHands, getMeanPosition, handsPresent, getFirstPosition, getSecondPosition } from './Leap/utils.js';
import * as Leap from 'leapjs'; 

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'; 
import model from './models/laberynth.stl'; 

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { defineTrajectory, TrajectoryManager } from './GUI/cameraMovement.js';
// import Stats from 'three/examples/jsm/libs/stats.module'

let isCameraInTrajectory = false; 
let cameraTrajectory = null; 
let reachedTarget = false; 
let end = new THREE.Vector3(0, 3, 0); 

const trajectoryManager = new TrajectoryManager(); 

// Main config for scene 
const scene = new THREE.Scene();
const cubeScene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const cubeGUICamera = new THREE.PerspectiveCamera( 75, 1, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const cubeGUIRenderer = new THREE.WebGLRenderer({ alpha: true } );

const CircleUISize = 0.06; 
let geometry = new THREE.CircleGeometry( CircleUISize, 40 );
let geometrySmall = new THREE.CircleGeometry( CircleUISize * 0.5, 40 );
let material = new THREE.MeshNormalMaterial( { color: "blue", opacity: 0.6, transparent: true} );

let spinVelocity = 0.001; 
let mesh ; 

const controls = new OrbitControls( camera, renderer.domElement );

let handCube = new THREE.Mesh( geometry, material );
handCube.visible = false; 

let handCubeLeft = new THREE.Mesh( geometrySmall, material );
let handCubeRight = new THREE.Mesh( geometrySmall, material );

// WebSocket 
const WEBSOCKET_URL = 'wss://demo.piesocket.com/v3/channel_123?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self'; 
const ws = new WebSocket(WEBSOCKET_URL); 

ws.addEventListener('open', e => {
    console.log(e)
    // ws.send('')
}); 

ws.addEventListener('close', e => {
    alert('closed')
}); 



handCubeLeft.visible = false; 
handCubeRight.visible = false; 

// hands group 
let handsGroup = new THREE.Group(); 
handsGroup.add(handCube); 
handsGroup.add(handCubeLeft); 
handsGroup.add(handCubeRight); 

handsGroup.visible = false; 
scene.add(handCube)
scene.add(handCubeLeft)
scene.add(handCubeRight)



renderer.setSize( window.innerWidth, window.innerHeight );
cubeGUIRenderer.setSize( window.innerHeight * 0.2, window.innerHeight * 0.2); 


document.body.appendChild( renderer.domElement );
let cubeGUI = document.body.appendChild( cubeGUIRenderer.domElement );
cubeGUI.className = "cubeRenderer"; 

// Main configurations baseline: 
let plane = createBaseGrid(scene); 
let cube = createCube(cubeScene, cubeGUIRenderer); 

// Camera positions 
const cameraInitialPosition = new THREE.Vector3(0, 1, 3); 
const cameraInitialRotation = new THREE.Vector3(-0.2, 0, 0); 

const cameraInitialAttitude = {
    'position': cameraInitialPosition, 
    'rotation': cameraInitialRotation
}

camera.position.z = 3
camera.position.y = 1; 
camera.rotation.x = -0.2; 

cubeGUICamera.position.z = 3.5
cubeGUICamera.position.y = 1; 
cubeGUICamera.position.x = -2; 
cubeGUICamera.rotation.x = -0.2; 



animate(); // Animate

/*
*
*/ 

function animate() {
    requestAnimationFrame( animate );

    renderer.render( scene, camera );
    cubeGUIRenderer.render( cubeScene, cubeGUICamera )
    // Current positoin 
    // Final Position

    // animate camera
    if(isCameraInTrajectory){
        
        if(controls.target != mesh.position)
            controls.target = mesh.position;   
        controls.update()
        // Trajectory 

        if(!reachedTarget){
            // console.log(reachedTarget)
            const start = camera.position; 
            // const end   = new THREE.Vector3(0, 3, 0); 
            
            const lambda = new THREE.Vector3().subVectors(end, start); 
            const vel = 0.03; 
            const d = camera.position.distanceTo(end)

            // cameraTrajectory = defineTrajectory(start, end, vel); 
            // console.log(camera.position.add(lambda.normalize().multiplyScalar(vel)))
            camera.position.add(lambda.normalize().multiplyScalar(vel * d))
            
            
            if(d <= 0.01){
                reachedTarget = true; 
                // console.log("NICE")
            }
        }
    }

    controls.update()
};


/*
*
*/ 
window.addEventListener('resize', ()=> {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    // render(); 
}, false)

/**
 *  LEAP MOTION 
 */

// Leap Motion 
// console.log(Leap)
var controller = Leap.loop( frame => frameFunction(frame)); 
LeapConfig(controller); 

// camera.position.set( 0, 20, 100 );
controls.autoRotate = false; 

controls.update()
// setTimeout(() => {camera.position.set( 0, 20, 100 ); }, 2000)

/**
 * STL Loader
 */
const loader = new STLLoader()
loader.load(
    model,
    function (geometry) {
        
        const ptsMaterial=  new THREE.PointsMaterial({ color: 0xFFFFFF, size: 0.02 }); 
        const material = new THREE.MeshNormalMaterial(
            {
                wireframe: false, 
                color: 'white', 
                emissive: 'black',
                
                roughness: 1, 
                vertexColors: true, 
                
            }
            )
        mesh = new THREE.Mesh(geometry, material)

        mesh.scale.x = 0.015; 
        mesh.scale.y = 0.015; 
        mesh.scale.z = 0.015; 

        const l = new THREE.AmbientLight(); 
        scene.add(l)

        

        mesh.rotation.x = -Math.PI/2
        scene.add(mesh)
    },
    (xhr) => {
        // console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)



// Orbit controls 
// controls.target.set(mesh.position)


/**
 *  Frame Function for Leap 
 * 
 *  Invoked each frame lecture for the Leap Motion 
 * 
 * @param {*} frame 
 * @returns 
 */
function frameFunction(frame){

    if(!handsPresent(frame)){
        // mesh.rotation.z = Math.PI/2; 
        // mesh.rotation.y = 0;

        handCube.visible = false;
        handCubeLeft.visible = false; 
        handCubeRight.visible = false;  
        plane.material.opacity = 0.3; 
        spinVelocity = 0.001; 
        isCameraInTrajectory = true; 
        reachedTarget = false; 
        end = new THREE.Vector3(0, 3, 0); 
        controls.autoRotate = true; // Resume Camera rotation
        

        // console.log(camera.position)
        return; 
    }
    reachedTarget = false; 
    end = new THREE.Vector3(0, 1, 3); 
    isCameraInTrajectory = true; 
    controls.autoRotate = false; // No Camera Rotation
    // camera.position.x = cameraInitialPosition.x; 
    // camera.position.y = cameraInitialPosition.y; 
    // camera.position.z = cameraInitialPosition.z; 
    
    // camera.rotation.x = cameraInitialRotation.x;
    // camera.rotation.y = cameraInitialRotation.y;
    // camera.rotation.z = cameraInitialRotation.z;
    
    // When hands are present 
    spinVelocity = 0;              // base plane angular velocity 
    plane.material.opacity = 0.1;  // base plane opacity 
    handCube.visible = true;       // Hand Indicator (Mean) 
    handCubeLeft.visible = true;   // Hand Indicator (1st) 
    handCubeRight.visible = true;  // Hand Indicator (2nd) 

    if(getAmountOfHands(frame) < 2){
        handCubeLeft.visible = false; 
        handCubeRight.visible = false;  
    }

    const pos = getMeanPosition(frame); 

    // TODO: Change HandCube name to handIndicator or something like that 
    handCube.position.x = pos[0] / 100; 
    handCube.position.y = pos[1] / 100; 
    handCube.position.z = pos[2] / 100; 

    // getHand Orientation 
    // Angle for Rotation in THREEjs in radians 
    // Math.acos in radians too :D
    if(getAmountOfHands(frame) == 1){
        let n = frame.hands[0].palmNormal; 
        
        // Leap.vec3.normalize(n, frame.hands[0].palmNormal); 
        // Leap.vec3.scale(n, n, -1); 

        


        // Directions 
        let theta = new Array(3); 
        for(let i = 0; i < theta.length; i++){
            if(i == 0 || i == 2)
                theta[i] = Math.acos(-n[i]);  // rads
            else {
                theta[i] = Math.acos(-n[i]);  // rads
                
            }
            // console.log(theta[i]); 
        }



        // console.log(`Angle: ${theta}`); 
        
        cube.rotation.x = -theta[2] + Math.PI/2; 
        cube.rotation.y = theta[0]; 
        cube.rotation.z = theta[0] - Math.PI/2; 

        //cube.rotation.x = 0;
        cube.rotation.y = 0;
        //cube.rotation.z = 0;

        mesh.rotation.x = -theta[2] ; 
        mesh.rotation.y = theta[0]; 
        mesh.rotation.y = -(theta[0] - Math.PI/2); 
        // mesh.rotation.y = theta[0] - Math.PI/2; s

        //cube.rotation.x = 0;
        mesh.rotation.z =Math.PI/2;
        
        
        const data = {
            'pitch': theta[2], 
            'roll': theta[0] 
        }; 
        const dataString = JSON.stringify(data); 
        console.log(dataString); 
        ws.send(dataString);

        
    }
    

    

    let pos1, pos2; 

    // Individual Hands 
    pos1 = getFirstPosition(frame); 
    


    handCubeLeft.position.x = pos1[0] / 100; 
    handCubeLeft.position.y = pos1[1] / 100; 
    handCubeLeft.position.z = pos1[2] / 100; 
    
    if(getAmountOfHands(frame) == 2){
    pos2 = getSecondPosition(frame);
    handCubeRight.position.x = pos2[0] / 100; 
    handCubeRight.position.y = pos2[1] / 100; 
    handCubeRight.position.z = pos2[2] / 100; 
    }
    
}
