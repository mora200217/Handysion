// OrientationCube.js 

import * as THREE from 'three'
/**
 * createCube 
 * 
 * Creates the orientation cube for GUI
 * @param { THREE.Scene } scene 
 * @return { THEE.Mesh } cube 
 * 
 */
export function createCube(scene, renderer){
    const CUBE_DIMENSION = 1.3; 

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    //Create a DirectionalLight and turn on shadows for the light
    const light = new THREE.PointLight( 0xffffff, 1 );
    light.position.set( 1, 3, 4 ); //default; light shining from top
    let d = 1; 
    light.shadow.cameraLeft = -d;
    light.shadow.cameraRight = d;
    light.shadow.cameraTop = d;
    light.shadow.cameraBottom = -d;
    light.castShadow = true; // default false
    scene.add( light );

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default

    let geometry = new THREE.BoxGeometry( CUBE_DIMENSION, CUBE_DIMENSION, CUBE_DIMENSION );
    let material = new THREE.MeshPhongMaterial( { color: "gray"} );

    let cube = new THREE.Mesh( geometry, material );
    
    cube.receiveShadow = true;
    cube.castShadow = true;

    const axesHelper = new THREE.AxesHelper( CUBE_DIMENSION * 1.2 );
    
    let group = new THREE.Group(); 
    group.add(cube); 
    group.add(axesHelper); 

    group.position.x = -2
    scene.add(group);

    const helper = new THREE.CameraHelper( light.shadow.camera );
    // scene.add( helper );

    return group; 
}
