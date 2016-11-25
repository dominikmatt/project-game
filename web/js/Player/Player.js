'use strict';

var THREE = require('three');
import scene from './../Scene.js';
import camera from './../Camera.js';
import map from './../Map/Map.js';
import Controls from './Controls.js';

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol();


/**
 * @class Player
 */
class Player {
    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton Player";
    }

    /**
     * @returns {Camera}
     */
    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new Player(singletonEnforcer);
        }

        return this[singleton];
    }

    update() {
        // update player
    }
}

export default Player;