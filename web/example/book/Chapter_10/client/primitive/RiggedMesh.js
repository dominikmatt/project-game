RiggedMesh= inherit(StageObject, function (geometry){
    superc(this);


    // init bones

    this.identityMatrix = mat4.create();

    this.bones = [];
    this.boneMatrices = [];

    this.skinIndexBuffer=null;
    this.skinWeightBuffer=null;
    //this.scale = vec3.fromValues(0.05,0.05,0.05 );

});

RiggedMesh.prototype.loadObject= function (data){


    this.geometry=parseJSON(data);
    //parseSkin(data,this.geometry);

    this.name=data.metadata.sourceFile.split(".")[0];

    if(this.geometry.materials.length>0){
        if(!(this.geometry.materials[0].colorDiffuse===undefined))
            this.diffuseColor=this.geometry.materials[0].colorDiffuse;
        if(!(this.geometry.materials[0].colorAmbient===undefined))
            this.ambientColor=this.geometry.materials[0].colorAmbient;

        if(!(this.geometry.materials[0].mapDiffuse===undefined)){
            this.materialFile=this.geometry.materials[0].mapDiffuse;
        }

    }
    var b, bone, gbone, p, q, s;

    if ( this.geometry && this.geometry.bones !== undefined ) {

        for ( b = 0; b < this.geometry.bones.length; b ++ ) {

            gbone = this.geometry.bones[ b ];

            p = gbone.pos;
            q = gbone.rotq;
            s = gbone.scl;

            bone = this.addBone();

            bone.name = gbone.name;
            bone.position=vec3.fromValues( p[0], p[1], p[2] );
            bone.quaternion=quat.fromValues( q[0], q[1], q[2], q[3] );

            if ( s !== undefined ) {

                bone.scale=vec3.fromValues( s[0], s[1], s[2] );

            } else {

                bone.scale=vec3.fromValues( 1, 1, 1 );

            }

        }

        for ( b = 0; b < this.bones.length; b ++ ) {

            gbone = this.geometry.bones[ b ];
            bone = this.bones[ b ];

            if ( gbone.parent === -1 ) {

                this.add( bone );

            } else {

                this.bones[ gbone.parent ].add( bone );

            }

        }

        //

        var nBones = this.bones.length;


        this.boneMatrices = new Float32Array( 16 * nBones );


        this.pose();

    }

}
RiggedMesh.prototype.createBuffers=function(gl){
    this.vbo = gl.createBuffer();
    this.ibo = gl.createBuffer();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.geometry.indices), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.vertices), gl.STATIC_DRAW);
    this.vbo.itemSize = 3;
    this.vbo.numItems = this.geometry.vertices.length/3;

    this.nbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.nbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.normals), gl.STATIC_DRAW);
    this.nbo.itemSize = 3;
    this.nbo.numItems = this.geometry.normals.length/3;
    this.skinIndexBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.skinIndexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.skinIndices), gl.STATIC_DRAW);
    this.skinIndexBuffer.itemSize = 4;
    this.skinIndexBuffer.numItems = this.geometry.skinIndices.length/4;
    this.skinWeightBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.skinWeightBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.skinWeights), gl.STATIC_DRAW);
    this.skinWeightBuffer.itemSize = 4;
    this.skinWeightBuffer.numItems = this.geometry.skinWeights.length/4;

    //This code assumes, for the purpose of learning that we have only one texture associated with each object
    if(this.materialFile!=null){

        this.verticesTextureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesTextureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.uvs[0]),gl.STATIC_DRAW);
    }

}


RiggedMesh.prototype.addBone = function( bone ) {

    if ( bone === undefined ) {
        bone = new Bone( this );

    }

    this.bones.push( bone );

    return bone;

};

RiggedMesh.prototype.updateMatrixWorld = function () {

    var offsetMatrix = mat4.create();

    return function ( force ) {

        this.matrixAutoUpdate && this.updateMatrix();

        // update matrixWorld

        if ( this.matrixWorldNeedsUpdate || force ) {

            if ( this.parent ) {

                mat4.mul( this.matrixWorld,this.parent.matrixWorld, this.modelMatrix );

            } else {

                mat4.copy(this.matrixWorld,this.modelMatrix );

            }

            this.matrixWorldNeedsUpdate = false;

            force = true;

        }

        // update children

        for ( var i = 0, l = this.children.length; i < l; i ++ ) {

            var child = this.children[ i ];

            if ( child instanceof Bone ) {

                child.update( this.identityMatrix, false );


            } else {

                child.updateMatrixWorld( true );

            }

        }

        // make a snapshot of the bones' rest position

        if ( this.boneInverses == undefined ) {

            this.boneInverses = [];

            for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

                var inverse = mat4.create();

                mat4.invert(inverse, this.bones[ b ].skinMatrix );

                this.boneInverses.push( inverse );

            }

        }

        // flatten bone matrices to array

        for ( var b = 0, bl = this.bones.length; b < bl; b ++ ) {

            // compute the offset between the current and the original transform;

            // TODO: we could get rid of this multiplication step if the skinMatrix
            // was already representing the offset; however, this requires some
            // major changes to the animation system


            mat4.mul(offsetMatrix, this.bones[ b ].skinMatrix, this.boneInverses[ b ] );

            this.flattenToArrayOffset(offsetMatrix, this.boneMatrices, b * 16 );

        }



    };

}();
RiggedMesh.prototype.flattenToArrayOffset=function(mat, flat, offset ) {

    var te = mat;
    flat[ offset ] = te[0];
    flat[ offset + 1 ] = te[1];
    flat[ offset + 2 ] = te[2];
    flat[ offset + 3 ] = te[3];

    flat[ offset + 4 ] = te[4];
    flat[ offset + 5 ] = te[5];
    flat[ offset + 6 ] = te[6];
    flat[ offset + 7 ] = te[7];

    flat[ offset + 8 ]  = te[8];
    flat[ offset + 9 ]  = te[9];
    flat[ offset + 10 ] = te[10];
    flat[ offset + 11 ] = te[11];

    flat[ offset + 12 ] = te[12];
    flat[ offset + 13 ] = te[13];
    flat[ offset + 14 ] = te[14];
    flat[ offset + 15 ] = te[15];

    return flat;

}

RiggedMesh.prototype.pose = function () {

    this.updateMatrixWorld( true );

    this.normalizeSkinWeights();

};

RiggedMesh.prototype.normalizeSkinWeights = function () {



        for ( var i = 0; i < this.geometry.skinIndices.length; i ++ ) {

            var sw = this.geometry.skinWeights[ i ];

            vec4.normalize(sw,sw);

        }



};
RiggedMesh.prototype.update=function(steps){

    this.updateMatrixWorld(true);

    this.updateMatrix();

}

RiggedMesh.prototype.clone = function ( object ) {

    if ( object === undefined ) {

        object = new RiggedMesh( this.geometry );

    }



    return object;

};
