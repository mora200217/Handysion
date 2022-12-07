// main js
import  { createBaseGrid }  from "./GUI/grid.js";
import { createCube } from './GUI/orientationCube.js';
import { LeapConfig } from "./Leap/config.js";
import { getAmountOfHands, getMeanPosition, handsPresent, getFirstPosition, getSecondPosition } from './Leap/utils.js';

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

    plane.rotation.y += 0.001; 

    // GUI 
    cube.rotation.y += 0.01; 
    cube.rotation.z += 0.01; 

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
    render()
}, false)

/**
 *  LEAP MOTION 
 */

// Leap Motion 
var controller = Leap.loop( frame => frameFunction(frame))
LeapConfig(controller); 





function frameFunction(frame){

    if(!handsPresent(frame)){
        handCube.visible = false;
        handCubeLeft.visible = false; 
        handCubeRight.visible = false;  
        return; 
    }
    
    handCube.visible = true; 
    handCubeLeft.visible = true; 
    handCubeRight.visible = true; 

    if(getAmountOfHands(frame) < 2){
        handCubeLeft.visible = false; 
        handCubeRight.visible = false;  
    }

    const pos = getMeanPosition(frame); 

    handCube.position.x = pos[0] / 100; 
    handCube.position.y = pos[1] / 100; 
    handCube.position.z = pos[2] / 100; 

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
