'use strict';
var THREE = require('three');

export default class TerrainGeometry {
    constructor(config) {
        /**
         * @type object
         */
        this.config = config;

        /**
         * @type {THREE.BufferGeometry}
         */
        this._bufferGeometry = null;

        this.width = 2048;
        this.length = 2048;
        this.widthSegs = 1000;
        this.lengthSegs = 1000;
        this.heightScale = 200.0;
    }

    createGeometry() {
        let vertsWidth = this.widthSegs + 1;
        let vertsLength = this.lengthSegs + 1;
        let numberOfVerts = vertsWidth * vertsLength;
        let triangles = this.widthSegs * this.lengthSegs * 2;
        let chunkSize = 21845;

        this.bufferGeometry = new THREE.BufferGeometry();
        this.bufferGeometry.dynamic = true;

        let indices = new Uint16Array(triangles * 3);
        let positions = new Float32Array(numberOfVerts * 3);
        let uvs = new Float32Array(numberOfVerts * 2);
        let startX = -this.width * 0.5;
        let startZ = -this.length * 0.5;
        let tileX = this.width / (vertsWidth - 1);
        let tileZ = this.length / (vertsLength - 1);

        // positions and uvs
        for (var length = 0; length < vertsLength; ++length) { //i
            for (var width = 0; width < vertsWidth; ++width) { //j
                let index = (length * vertsWidth + width) * 3;
                let uvIndex = (length * vertsWidth + width) * 2;

                positions[index + 0] = startX + width * tileX;
                positions[index + 1] = 0; // heightdata
                positions[index + 2] = startZ + length * tileZ;

                uvs[uvIndex + 0] = width / (vertsWidth - 1);
                uvs[uvIndex + 1] = 1.0 - length / (vertsLength - 1);

            }
        }

        this.bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

        // For each rectangle, generate its indices
        var lastChunkRow = 0;
        var lastChunkVertStart = 0;

        for (var length = 0; length < this.lengthSegs; ++length) { // i
            let startVertIndex = length * vertsWidth;

            if ((startVertIndex - lastChunkVertStart) + vertsWidth * 2 > chunkSize) {
                let newChunk = {
                    start: lastChunkRow * this.widthSegs * 6,
                    index: lastChunkVertStart,
                    count: (length - lastChunkRow) * this.widthSegs * 6
                };

                this.bufferGeometry.groups.push(newChunk);

                lastChunkRow = length;
                lastChunkVertStart = startVertIndex;
            }
        }

        this.terrainHeight = THREE.ImageUtils.loadTexture(
            '/assets/maps/' + this.config.map + '/heightdata.png',
            undefined,
            this.onTerrainHeightmapLoaded.bind(this)
        );

        for (var width = 0; width < this.widthSegs; ++width) { // j
            let index = (length * this.widthSegs + width) * 6;
            let vertIndex = (length * vertsWidth + width) - lastChunkVertStart;

            indices[index + 0] = vertIndex;
            indices[index + 1] = vertIndex + vertsWidth;
            indices[index + 2] = vertIndex + 1;
            indices[index + 3] = vertIndex + 1;
            indices[index + 4] = vertIndex + vertsWidth;
            indices[index + 5] = vertIndex + vertsWidth + 1;
        }

        /*let lastChunk = {
            start: lastChunkRow * this.widthSegs * 6,
            index: lastChunkVertStart,
            count: (this.lengthSegs - lastChunkRow) * this.widthSegs * 6
        };

        this.bufferGeom.offsets.push(lastChunk);*/
        this.bufferGeometry.setIndex(new THREE.BufferAttribute(indices, 3 ) );
        this.bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute(positions, 3 ) );
        this.bufferGeometry.addAttribute( 'normal', new THREE.BufferAttribute(new Float32Array(numberOfVerts * 3), 3 ) );
        this.bufferGeometry.addAttribute( 'uv', new THREE.BufferAttribute(uvs, 2 ) );
        this.bufferGeometry.computeBoundingSphere();
    }

    onTerrainHeightmapLoaded() {
        console.debug('heightmap-image loaded…');
        let heightData = this.getHeightImageData().data;
        let mapWidth = this.terrainHeight.image.width;
        let mapLength = this.terrainHeight.image.height;

        var widthVerts = this.widthSegs + 1;
        var lengthVerts = this.lengthSegs + 1;

        for (var i = 0; i < lengthVerts; ++i) {

            var percentHeight = i / (lengthVerts - 1);

            for (var j = 0; j < widthVerts; ++j) {

                var percentWidth = j / (widthVerts - 1);

                var row = Math.round(percentHeight * (mapLength - 1));
                var column = Math.round(percentWidth * (mapWidth - 1));

                var rowPixel = row * mapWidth * 4;
                var columnPixel = column * 4;

                var index = rowPixel + columnPixel;

                var vertIndex = (i * widthVerts + j) * 3;

                this.bufferGeometry.attributes.position.array[vertIndex + 1] =
                    heightData[index] * this.heightScale / 255.0;
            }
        }

        this.bufferGeometry.computeVertexNormals();
        this.heightData = heightData;
    }

    getHeightImageData() {
        let canvas = document.createElement('canvas');
        let mapWidth = this.terrainHeight.image.width;
        let mapLength = this.terrainHeight.image.height;
        let context = canvas.getContext('2d');

        canvas.width = mapWidth;
        canvas.height = mapLength;

        context.drawImage(this.terrainHeight.image, 0, 0);

        return context.getImageData(0, 0, mapWidth, mapLength);
    }

    set bufferGeometry(bufferGeometry) {
        this._bufferGeometry = bufferGeometry;
    }

    get bufferGeometry() {
        return this._bufferGeometry;
    }
}