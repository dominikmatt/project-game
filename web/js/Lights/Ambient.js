'use strict';

import THREE from 'three';
import scene from './../Scene.js';

/**
 * basic light for all objects
 * - no shadow
 * - no color
 *
 * @class AmbientLight
 */
class AmbientLight {
    constructor() {
        console.debug('add AmbientLight…');

        var ambientLight = new THREE.AmbientLight(0x222222);

        scene.scene.add(ambientLight);
    }
}

export default AmbientLight;