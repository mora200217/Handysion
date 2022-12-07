// main js
import * as THREE from 'three'

import  { createBaseGrid }  from "./GUI/grid.js";
import { createCube } from './GUI/orientationCube.js';
import { LeapConfig } from "./Leap/config.js";
import { getAmountOfHands, getMeanPosition, handsPresent, getFirstPosition, getSecondPosition } from './Leap/utils.js';
import * as Leap from 'leapjs'; 

import { STLLoader } from 'three/examples/jsm/loaders/STLLoader'; 
import model from './models/laberynth.stl'; 
// import { TrueLiteral } from '../node_modules/typescript/lib/typescript.d';
console.log(Leap.vec3)
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

let handCube = new THREE.Mesh( geometry, material );
handCube.visible = false; 

let handCubeLeft = new THREE.Mesh( geometrySmall, material );
let handCubeRight = new THREE.Mesh( geometrySmall, material );

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

    plane.rotation.y += spinVelocity; 
    if(mesh !== undefined)
    mesh.rotation.z += spinVelocity; 

    // GUI 
    // cube.rotation.y += 0.01; 
    // cube.rotation.z += 0.01; 

    renderer.render( scene, camera );
    cubeGUIRenderer.render( cubeScene, cubeGUICamera )
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
console.log(Leap)
var controller = Leap.loop( frame => frameFunction(frame)); 
LeapConfig(controller); 


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
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)




function frameFunction(frame){

    if(!handsPresent(frame)){
        handCube.visible = false;
        handCubeLeft.visible = false; 
        handCubeRight.visible = false;  
        plane.material.opacity = 0.3; 
        spinVelocity = 0.001; 
        return; 
    }
    
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
            console.log(theta[i]); 
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
