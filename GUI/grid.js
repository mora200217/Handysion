// grid.js 

export function createBaseGrid(scene){
        // Grid 
    const size = 7;
    const divisions = 10;

    const plane  = new THREE.GridHelper( size, divisions , 0xFFFFFF, 0xFFFFFF);

    plane.receiveShadow = true; 
    plane.castShadow = true; 
    plane.rotation.y = 0;  
    // plane.position.y = - 199;
    plane.material.opacity = 0.1;
    plane.material.transparent = true;
    plane.material.blendDst = 0x000000
    plane.material.blendSrc = 0x0000FF

    

    scene.add( plane ); 

    return plane; 
}