'use strict';

import THREE from 'three';
import scene from './../Scene.js';
import AmbientLight from './../Lights/Ambient.js';
var Physijs = require('physijs-browserify')(THREE);
var collada = require('three-loaders-collada')(THREE);

/**
 * @type {Symbol}
 */
let singleton = Symbol();

/**
 * @type {Symbol}
 */
let singletonEnforcer = Symbol();

/**
 * @class Map
 */
class Map {
    constructor(enforcer) {
        if (enforcer != singletonEnforcer) throw "Cannot construct singleton Map";

        this.colladaLoader = new THREE.ColladaLoader();
        this._terrain = null;
        console.debug('create map…');

        new AmbientLight();
    }

    /**
     * @returns {Map}
     */
    static get instance() {
        if (!this[singleton]) {
            this[singleton] = new Map(singletonEnforcer);
        }

        return this[singleton];
    }

    /**
     * create terrain for map
     */
    createTerrain() {
        console.debug('create terrain…');

        var material = this.getCustomMaterial();
        var terrainGeometry = new THREE.Geometry();
        var counter = 0;

        //ground
        var groundMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
        var ground = new Physijs.ConcaveMesh(
            new THREE.BoxGeometry( 1000, 1, 1000 ),
            Physijs.createMaterial(groundMaterial, 0.8, 0.2),
            0
        );
        ground.name = 'Ground';

        //terrain
        this.colladaLoader.load('/example/models/terrain-test-1/RollingHills.dae', (collada) => {
            collada.scene.children.forEach((child) => {
                child.children.forEach((sub) => {
                    if (sub.name === 'TerrainCell') {
                        var mesh = sub.children[0];
                        mesh.position.set(sub.position.x, sub.position.y, sub.position.z);
                        mesh.name = 'TerrainCell-' + counter;
                        mesh.updateMatrix();

                        terrainGeometry.merge(mesh.geometry, mesh.matrix);
                        counter++;
                    }
                });
            });

            //this._terrain = new THREE.Mesh(terrainGeometry, material);
            //this._terrain = collada.scene;
            this._terrain = new Physijs.ConcaveMesh(
                terrainGeometry,
                material,
                0
            );
            this.terrain.name = 'Terrain';
            this.terrain.updateMatrix();
            ground.add(this.terrain);

            scene.scene.add(ground);
            
            // testobject
            var boxMaterial = new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true });
            var box = new Physijs.BoxMesh(
                new THREE.CubeGeometry( 5, 5, 5 ),
                Physijs.createMaterial(boxMaterial, 0.6, 0.5),
                10
            );
            box.name = 'Box-test-object';
            box.position.set(120, 30, -170);
            scene.scene.add( box );
        });

        this.createOcean();
    }

    /**
     * create ocean
     */
    createOcean() {
        var waterGeometry = new THREE.PlaneGeometry(1000, 1000, 1, 1 );
        var waterTex = new THREE.ImageUtils.loadTexture('/assets/terrain/water-512.jpg');
        var waterMaterial = new THREE.MeshBasicMaterial({
            map: waterTex,
            transparent:true,
            wireframe: true,
            opacity:0.40
        });
        //var water = new THREE.Mesh(waterGeometry, waterMaterial );
        var water = new Physijs.PlaneMesh(
            waterGeometry,
            Physijs.createMaterial(waterMaterial, 0.8, 0.2),
            0
        );
        water.name = 'Ocean';

        waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping;
        waterTex.repeat.set(2,2);

        water.rotation.x = -Math.PI / 2;
        water.position.y = 0;

        //scene.scene.add(water);
    }

    /**
     * returns a shader material for terrain
     *
     * @returns {THREE.ShaderMaterial}
     */
    getCustomMaterial() {
        // load Ocean texture
        var oceanTexture = new THREE.ImageUtils.loadTexture( '/assets/terrain/materials/ocean.jpg' );
        oceanTexture.wrapS = oceanTexture.wrapT = THREE.RepeatWrapping;

        // load Sand texture
        var sandyTexture = THREE.ImageUtils.loadTexture( '/assets/terrain/materials/Sahara.png' );
        sandyTexture.wrapS = sandyTexture.wrapT = THREE.RepeatWrapping;

        // load Grass texture
        var grassTexture = THREE.ImageUtils.loadTexture( '/assets/terrain/materials/grass.png' );
        grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.repeat.set(512,512);

        // load Rocky texture
        var rockyTexture = new THREE.ImageUtils.loadTexture( '/assets/terrain/materials/rock.png' );
        rockyTexture.wrapS = rockyTexture.wrapT = THREE.RepeatWrapping;

        // load Snow texture
        var snowyTexture = new THREE.ImageUtils.loadTexture( '/assets/terrain/snow-512.jpg' );
        snowyTexture.wrapS = snowyTexture.wrapT = THREE.RepeatWrapping;

        var customUniforms = {
            oceanTexture:    { type: "t", value: oceanTexture },
            sandyTexture:    { type: "t", value: sandyTexture },
            grassTexture:    { type: "t", value: grassTexture },
            rockyTexture:    { type: "t", value: rockyTexture },
            snowyTexture:    { type: "t", value: snowyTexture }
        };

        // create custom material from the shader code above
        // that is within specially labelled script tags
        var customMaterial = new THREE.ShaderMaterial({
            uniforms: customUniforms,
            vertexShader: document.getElementById('vertexShader').textContent,
            fragmentShader: document.getElementById('fragmentShader').textContent,
            wireframe: false,
            light: true
        });

        return customMaterial;
    }

    /**
     * @returns {THREE.Mesh}
     */
    get terrain() {
        return this._terrain;
    }
}

export default Map.instance;