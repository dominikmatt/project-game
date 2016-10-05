'use strict';

import THREE from 'three';
import scene from './../Scene.js';
var Physijs = require('physijs-browserify')(THREE);

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol()

class Map {
    constructor(enforcer) {
        if(enforcer != singletonEnforcer) throw "Cannot construct singleton Camera";
    }

    /**
     * create terrain
     */
    createTerrain() {
        console.debug('create terrain…');
        
        let terrainMaterial = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                color: 0x0066ff,
                wireframe: true
            }),
            .8, // high friction
            1.4 // low restitution
        );

        var NoiseGen = new SimplexNoise();

        var terrainGeometry = new THREE.PlaneGeometry( 100, 100, 100, 100 );

        for ( var i = 0; i < terrainGeometry.vertices.length; i++ ) {
            var vertex = terrainGeometry.vertices[i];
            vertex.z = NoiseGen.noise( vertex.x / 10, vertex.y / 10 );
        }

        terrainGeometry.computeFaceNormals();
        terrainGeometry.computeVertexNormals();

        var terrain = new Physijs.HeightfieldMesh(
            terrainGeometry,
            terrainMaterial,
            1, // mass
            100,
            100
        );

        terrain.rotation.x = -0.5 * Math.PI;

        scene.scene.add( terrain );
    }

    createSphere() {
        var sphereGeometry = new THREE.SphereGeometry(500, 20, 20);
        var sphereMaterial = new THREE.MeshLambertMaterial({
            color: 0x7777ff,
            wireframe: false
        });
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        sphere.position.x = 20;
        sphere.position.y = 4;
        sphere.position.z = 2;
        sphere.castShadow = true;
        scene.scene.add(sphere);

        setInterval(() => {
            this.doCreateShape();
        }, 1000);
    }

    doCreateShape () {
        var addshapes = true,
            shapes = 0,
            box_geometry = new THREE.BoxGeometry( 3, 3, 3 ),
            sphere_geometry = new THREE.SphereGeometry( 1.5, 32, 32 ),
            cylinder_geometry = new THREE.CylinderGeometry( 2, 2, 1, 32 ),
            cone_geometry = new THREE.CylinderGeometry( 0, 2, 4, 32 ),
            octahedron_geometry = new THREE.OctahedronGeometry( 1.7, 1 ),
            torus_geometry = new THREE.TorusKnotGeometry ( 1.7, .2, 32, 4 ),
            doCreateShape;
        var shape, material = new THREE.MeshLambertMaterial({ opacity: 0, transparent: false, wireframe: true });

        switch ( Math.floor(Math.random() * 2) ) {
            case 0:
                shape = new Physijs.BoxMesh(
                    box_geometry,
                    material
                );
                break;

            case 1:
                shape = new Physijs.SphereMesh(
                    sphere_geometry,
                    material,
                    undefined,
                    { restitution: Math.random() * 1.5 }
                );
                break;
        }

        shape.material.color.setRGB( Math.random() * 100 / 100, Math.random() * 100 / 100, Math.random() * 100 / 100 );
        shape.castShadow = true;
        shape.receiveShadow = true;

        shape.position.set(
            Math.random() * 30 - 15,
            20,
            Math.random() * 30 - 15
        );

        shape.rotation.set(
            0, 0, 0
        );

        console.debug('add shape…');
        scene.scene.add( shape );
    }

    /**
     * @returns {Map}
     */
    static get instance() {
        if(!this[singleton]) {
            this[singleton] = new Map(singletonEnforcer);
        }

        return this[singleton];
    }

    /**
     * @returns {THREE.Mesh}
     */
    get terrain() {
        return this._terrain;
    }
}

export default Map;