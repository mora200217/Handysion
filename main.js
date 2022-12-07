// main js
import  { createBaseGrid }  from "./GUI/grid.js";
import { createCube } from './GUI/orientationCube.js';


// Main config for scene 
const scene = new THREE.Scene();
const cubeScene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const cubeGUICamera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const renderer = new THREE.WebGLRenderer();
const cubeGUIRenderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
cubeGUIRenderer.setSize( window.innerWidth * 0.2, window.innerHeight * 0.2); 


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