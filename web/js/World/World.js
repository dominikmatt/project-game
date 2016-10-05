'use strict';

import CANNON from 'cannon';
import map from './../Map/Map.js';

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol()

/**
 * @type {number}
 */
let timeStep=1/60

class World {
    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton Camera";

        var world = new CANNON.World();
        world.gravity.set(0, 0, -9.82); // m/s²
    }

    /**
     * @returns {Map}
     */
    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new World(singletonEnforcer);
        }

        return this[singleton];
    }

    updatePhysics() {
       /* // Step the physics world
        this.world.step(timeStep);
        console.log(this.sphereBody.position.x, this.sphereBody.position.y, this.sphereBody.position.z);*/
    }

    /**
     * @returns {CANNON.World}
     */
    get world() {
        return this._world;
    }
}

export default World.instance;