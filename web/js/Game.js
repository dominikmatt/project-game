'use strict';
import scene from './Scene.js';
import renderer from './Renderer.js';
import camera from './Camera.js';

var THREE = require('three');
var Physijs = require('physijs-browserify')(THREE);

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol()

/**
 * Scene of the Game.
 * Created with PhysiJS
 *
 * @class Scene
 */
class Game {
    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton Game";
    }

    /**
     * @returns {Game}
     */
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new Game(singletonEnforcer);
        }

        return this[singleton];
    }

    /**
     * Start Game means initialize player, objects,….
     */
    start() {
        this.clock = new THREE.Clock();
        this.render();
    }

    /**
     * Render Map
     */
    render() {
        let delta = this.clock.getDelta();
        camera.update(); // update camera
        scene.scene.simulate(); // update physics

        renderer.render(); // render map
        requestAnimationFrame( this.render.bind(this) );
    }
}

export default Game.instance;