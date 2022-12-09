import * as THREE from 'three'; 

/**
 * 
 * @param { THREE.Vector3 } src 
 * @param { THREE.Vector3 } dest 
 * @param { float } vel 
 */
export function defineTrajectory(src, dest, vel){
    const n = 100; // Amount of steps 

    let targetVector = new THREE.Vector3(); 
    targetVector.subVectors(dest, src); 

    const FACTOR = 2; // increased size factor 
    let keyPoints = new Array(n).fill(2); 
    keyPoints = keyPoints.map((e, t) => {
        const param = t/n; 
        const normalTargetVector = targetVector.copy(); 
        return normalTargetVector.multiplyScalar(param * targetVector.length()); 
    }

    ); 

    return keyPoints; 

}

export class TrajectoryManager{
    constructor(){
        // this.src;
        // this.dst;
        // this.vel;

        // this.body; 
    }

    setParams({ body, dst, vel}){
        this.body = body; 
        this.dst = dst; 
        this.src = this.body.src; 
    }

    init(){
        this.reachedTarget = false; 
    }

    updatePosition(body){
        this.body.position.add()
    }

    getNormalizedDirection(){
        const ref = this.body.position.copy(); 
        const refdst = this.dst; 

        const direction = refdst.sub(ref); 
        return direction.normalize(); 
    }


    updateInitialPosition(){
        const {position} = this.body; 

        this.src = position.add(this.getNormalizedDirection() * this.vel); 
    }
    getTargetDistance(){
        return this.body.position.distanceTo(this.dst); 
    }

}