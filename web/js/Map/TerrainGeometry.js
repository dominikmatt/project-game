'use strict';

import { DEBUG } from './../constants.js';

/**
 * Creates TerrainGeometry.
 */
export default class TerrainGeometry {
    constructor(config) {
        /**
         * @type object
         */
        this.config = config;

        /**
         * @type {THREE.PlaneGeometry}
         * @private
         */
        this._groundGeometry = null;

        /**
         * @type {number}
         * @private
         */
        this._mapWidth = 0;

        /**
         * @type {number}
         * @private
         */
        this._mapLength = 0;

        return this.promise;
    }

    /**
     * Create Geometry for Terrain.
     *
     * @returns {Promise}
     */
    createGeometry() {
        return new Promise((resolve, reject) => {
            this.terrainHeight = THREE.ImageUtils.loadTexture(
                '/assets/maps/' + this.config.map + '/heightdata.png',
                undefined,
                this.onTerrainHeightmapLoaded.bind(this, resolve, reject)
            );
        })
    }

    /**
     * Called after heihtfield-image is loaded and generates the vertices.
     *
     * @param {Promise.resolve} resolve
     * @param {Promise.reject} reject
     */
    onTerrainHeightmapLoaded(resolve, reject) {
        let heightData = this.getHeightImageData().data;
        let groundGeometry = new THREE.PlaneGeometry( this.mapWidth, this.mapLength, this.mapWidth - 1, this.mapLength - 1 );
        let verticesIndex = 0;

        // Calculate Vertice height.
        if (!DEBUG.flatMap) {
            for (var index = 0; index < heightData.length; index += (4)) {
                var all = heightData[index] + heightData[index + 1] + heightData[index + 2];

                // set it to PlaneGeometry
                groundGeometry.vertices[verticesIndex].z = all / (20 * 6);
                verticesIndex++;
            }
        }

        groundGeometry.computeFaceNormals();
        groundGeometry.computeVertexNormals();

        this.groundGeometry = groundGeometry;

        resolve();
    }

    /**
     * Append Heightfield image to dom.
     *
     * @returns {ImageData}
     */
    getHeightImageData() {
        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        this.mapWidth = this.terrainHeight.image.width;
        this.mapLength = this.terrainHeight.image.height;

        canvas.width = this.mapWidth;
        canvas.height = this.mapLength;

        context.drawImage(this.terrainHeight.image, 0, 0);

        return context.getImageData(0, 0, this.mapWidth, this.mapLength);
    }

    /**
     * @param {THREE.PlaneGeometry} groundGeometry
     */
    set groundGeometry(groundGeometry) {
        this._groundGeometry = groundGeometry;
    }

    /**
     * @returns {THREE.PlaneGeometry}
     */
    get groundGeometry() {
        return this._groundGeometry;
    }

    /**
     * @param {int} width
     */
    set mapWidth(width) {
        this._mapWidth = width;
    }

    /**
     * @returns {int}
     */
    get mapWidth() {
        return this._mapWidth;
    }

    /**
     * @param {int} length
     */
    set mapLength(length) {
        this._mapLength = length;
    }

    /**
     * @returns {int}
     */
    get mapLength() {
        return this._mapLength;
    }
}