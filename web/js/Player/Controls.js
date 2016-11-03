'use strict';

import THREE from 'three';
import scene from './../Scene.js';
import camera from './../Camera.js';
import map from './../Map/Map.js';

/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function ( camera ) {

    var scope = this;

    camera.rotation.set( 0, 0, 0 );

    var pitchObject = new THREE.Object3D();
    pitchObject.add( camera );

    var yawObject = new THREE.Object3D();
    yawObject.position.y = 0;
    yawObject.add( pitchObject );

    var PI_2 = Math.PI / 2;

    var onMouseMove = function ( event ) {
        if ( scope.enabled === false ) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * 0.002;
        pitchObject.rotation.x -= movementY * 0.002;

        pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

    };

    this.dispose = function() {

        document.removeEventListener( 'mousemove', onMouseMove, false );

    };

    document.addEventListener( 'mousemove', onMouseMove, false );

    this.enabled = false;

    this.getObject = function () {

        return yawObject;

    };

    this.getDirection = function() {

        // assumes the camera itself is not rotated

        var direction = new THREE.Vector3( 0, 0, - 1 );
        var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

        return function( v ) {

            rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

            v.copy( direction ).applyEuler( rotation );

            return v;

        };

    }();

};

/**
 * @class Controls
 */
export default class Controls {
    constructor() {
        this.body = document.body;

        this.move = {
            forward: false,
            backward: false,
            left: false,
            right: false
        };
        this.speed = 200;
        this.velocity = new THREE.Vector3();

        this.bindEvents();
        this.controls = new THREE.PointerLockControls(camera.camera);
        this.controls.enabled = true;

        scene.scene.add(this.controls.getObject());
    }

    /**
     * bin all DOM events
     */
    bindEvents() {
        document.body.addEventListener('click', this.onBodyClickHandler.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this), false);
        document.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    /**
     * start pointer lock
     * TODO: create instructions and move it to that component
     *
     * @deprecated
     */
    onBodyClickHandler() {
        this.body.requestPointerLock();
    }

    /**
     * @param {Event} event
     */
    onKeyDown(event) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                this.move.forward = true;
                break;
            case 37: // left
            case 65: // a
                this.move.left = true;
                break;
            case 40: // down
            case 83: // s
                this.move.backward = true;
                break;
            case 39: // right
            case 68: // d
                this.move.right = true;
                break;
            case 32: // space
                // TODO: implement jump
                break;
        }
    }

    /**
     * @param {Event} event
     */
    onKeyUp(event) {
        switch ( event.keyCode ) {
            case 38: // up
            case 87: // w
                this.move.forward = false;
                break;
            case 37: // left
            case 65: // a
                this.move.left = false;
                break;
            case 40: // down
            case 83: // s
                this.move.backward = false;
                break;
            case 39: // right
            case 68: // d
                this.move.right = false;
                break;
            case 32: // space
                // TODO: implement jump
                break;
        }
    }

    /**
     * update move position
     *
     * @param {float} delta
     * @param {Player} player
     */
    update(delta, player) {
        this.velocity.x -= this.velocity.x * 10.0 * delta;
        this.velocity.z -= this.velocity.z * 10.0 * delta;
        this.velocity.y -= 9.8 * 100.0 * delta;

        if (this.move.forward) this.velocity.z -= this.speed * delta;
        if (this.move.backward) this.velocity.z += this.speed * delta;
        if (this.move.left) this.velocity.x -= this.speed * delta;
        if (this.move.right) this.velocity.x += this.speed * delta;

        this.controls.getObject().translateX(this.velocity.x * delta);
        this.controls.getObject().translateY(0);
        this.controls.getObject().translateZ(this.velocity.z * delta);

        if (this.move.forward) {
            var distance = this.toBottom(delta);
            console.debug('distance:', distance);
            this.controls.getObject().position.y -= distance;

            if (this.controls.getObject().position.y <= 1) {
                this.controls.getObject().position.y = 1;

                this.speed = 100;
            } else {
                this.speed = 200;
            }

            camera.camera.position.y = this.controls.getObject().position.y;
            //console.debug(this.controls.getObject().position);
            //console.debug('position:', this.controls.getObject().position.y);

        }
    }

    /**
     * @param {flaot} delta
     */
    toBottom(delta) {
        if (!map.terrain) {
            return;
        }

        var raycaster = new THREE.Raycaster();
        var velocity = new THREE.Vector3();
        var distance = 0;
        var objects = [];

        raycaster.set(this.controls.getObject().position, new THREE.Vector3(0, -1, 0));
        map.terrain.children.forEach(function(child) {
            child.children.forEach(function(sub) {
                objects.push(sub);
            });
        });

        var intersects = raycaster.intersectObjects( objects, true );
        console.debug(intersects);

        if (intersects.length) {
            return intersects[0].distance;
        } else {
            this.controls.getObject().position.y += 10;
            return this.toBottom(delta);
        }
        /*if (!intersects.length) {
            this.player.position.y = 100;
            return;
        }

        if (distance < intersects[0].distance) {
            this.player.position.y -= intersects[0].distance - 1; // the -1 is a fix for a shake effect I had
        }

        // TODO: add wather physics
        if (this.player.position.y < 0) {
            this.player.position.y = 0;
        }

        //gravity and prevent falling through floor
        if (distance >= intersects[0].distance && velocity.y <= 0) {
            velocity.y = 0;
        } else if (distance <= intersects[0].distance && velocity.y === 0) {
            velocity.y -= delta ;
        }*/

    }
}