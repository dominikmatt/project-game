StageObject=function(){
    this.name="";
    this.geometry=new Geometry();
    this.ibo=null;//Index buffer object
    this.vbo=null;//Buffer object for vertices
    this.nbo=null;//Buffer Object for normals

    this.diffuseColor=[1.0,1.0,1.0,1.0];
    this.ambientColor=[1.0, 1.0, 1.0];
    this.specularColor=[0.000000000000001, 0.0000000000000001, 0.0000000000000001];
    this.verticesTextureBuffer=null;
    this.textureIndex=0;
    this.materialFile=null;
    this.camera=null;
    this.modelMatrix=mat4.create();
    this.rigidBody=null;
    this.system=null;
    this.callBack=null;

    this.parent = undefined;
    this.children = [];

    this.up = vec3.fromValues( 0, 1, 0 );

    this.position = vec3.create();
    //this.rotation = new THREE.Euler();
    this.quaternion = quat.create();
    this.scale = vec3.fromValues(1,1,1 );

    this.matrixWorld = mat4.create();

    this.matrixAutoUpdate = true;
    this.matrixWorldNeedsUpdate = true;

    this.visible = true;


};
StageObject.prototype.loadObject= function (data){


        this.geometry=parseJSON(data);


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

 }
StageObject.prototype.initialize=function(){
         //For implementation in child class
    }

StageObject.prototype.createBuffers=function(gl){
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
        //This code assumes, for the purpose of learning that we have only one texture associated with each object
        if(this.materialFile!=null){

        this.verticesTextureBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesTextureBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.geometry.uvs[0]),gl.STATIC_DRAW);
        }

    }
StageObject.prototype.clone=function(){
        var stageObject=new StageObject();
        stageObject.geometry=this.geometry.clone();

        var i;
        for(i=0;i<this.diffuseColor.length;++i){
            stageObject.diffuseColor[i]=this.diffuseColor[i];
        }
        for(i=0;i<this.ambientColor.length;++i){
            stageObject.ambientColor[i]=this.ambientColor[i];
        }
        for(i=0;i<this.specularColor.length;++i){
            stageObject.specularColor[i]=this.specularColor[i];
        }
        stageObject.name=this.name;
        stageObject.quaternion=quat.clone(this.quaternion);
        stageObject.materialFile=this.materialFile;
        stageObject.textureIndex=this.textureIndex;
        stageObject.loaded=true;
        return stageObject;

    }
StageObject.prototype.rotate=function(radianX,radianY,radianZ){
  quat.rotateX(this.quaternion,this.quaternion,radianX);
    quat.rotateY(this.quaternion,this.quaternion,radianY);
    quat.rotateZ(this.quaternion,this.quaternion,radianZ);

}
StageObject.prototype.setRotationFromAxisAngle=function ( axis, angle ) {
    // assumes axis is normalized
    quat.setAxisAngle(this.quaternion, axis, angle );
}
StageObject.prototype.setRotationFromMatrix= function ( m ) {
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
    quat.fromMat3(this.quaternion, m );
}

StageObject.prototype.setRotationFromQuaternion=function ( q ) {
    // assumes q is normalized
    this.quaternion=quat.clone( q );

}

StageObject.prototype.rotateOnAxis= function(axis, angle) {

    // rotate object on axis in object space
    // axis is assumed to be normalized
    quat.setAxisAngle(this.quaternion, axis, angle );

}

StageObject.prototype.rotateX= function (angle) {
    var v1 = vec3.fromValues( 1, 0, 0 );
        return this.rotateOnAxis( v1, angle );

}

    StageObject.prototype.rotateY= function (angle) {
    var v1 = vec3.fromValues( 0, 1, 0 );
        return this.rotateOnAxis( v1, angle );

}

    StageObject.prototype.rotateZ=function (angle) {

    var v1 = vec3.fromValues( 0, 0, 1 );
        return this.rotateOnAxis( v1, angle );

}

    StageObject.prototype.translateOnAxis= function (axis, distance) {

    // translate object by distance along axis in object space
    // axis is assumed to be normalized

    var v1 = vec3.create();
        vec3.copy(v1, axis );
        vec3.transformQuat( v1,v1,this.quaternion );
        vec3.scale(v1,v1,distance);
        vec3.add(this.position,this.position,v1);
        return this;
}

StageObject.prototype.translate=function ( distance, axis ) {

    console.warn( 'DEPRECATED: Object3D\'s .translate() has been removed. Use .translateOnAxis( axis, distance ) instead. Note args have been changed.' );
    return this.translateOnAxis( axis, distance );

}

StageObject.prototype.translateX= function () {

    var v1 = vec3.fromValues( 1, 0, 0 );

    return function ( distance ) {

        return this.translateOnAxis( v1, distance );

    };

}();

StageObject.prototype.translateY= function () {

    var v1 = vec3.fromValues( 0, 1, 0 );

    return function ( distance ) {

        return this.translateOnAxis( v1, distance );

    };

}();

StageObject.prototype.translateZ= function () {

    var v1 = vec3.fromValues( 0, 0, 1 );

    return function ( distance ) {

        return this.translateOnAxis( v1, distance );

    };

}();

StageObject.prototype.localToWorld= function ( vector ) {
    var v1=vec3.create();
    vec3.transformQuat(v1,vector,this.matrixWorld );
    return v1;
};

  StageObject.prototype.worldToLocal= function () {

    var m1 = mat4.create();

    return function ( vector ) {
        mat4.invert(m1,this.matrixWorld);
        var v1=vec3.create();
        vec3.transformQuat(v1,vector,m1 );
        return v1;

    };

}();

StageObject.prototype.lookAt= function () {

    // This routine does not support objects with rotated and/or translated parent(s)

    var m1 = mat4.create();

    return function ( vector ) {

        mat4.lookAt( m1, vector, this.position, this.up );
        var m2=mat3.fromMat4(m1);
        quat.fromMat3(this.quaternion, m2 );


    };

}();

StageObject.prototype.add=function ( object ) {

    if ( object === this ) {

        console.warn( 'THREE.Object3D.add: An object can\'t be added as a child of itself.' );
        return;

    }


    if ( object.parent !== undefined ) {

        object.parent.remove( object );

    }

    object.parent = this;
    //object.dispatchEvent( { type: 'added' } );

    this.children.push( object );

    // add to scene





};

StageObject.prototype.remove= function ( object ) {

    var index = this.children.indexOf( object );

    if ( index !== - 1 ) {

        object.parent = undefined;
        //object.dispatchEvent( { type: 'removed' } );
        this.children.splice( index, 1 );

    }

}

StageObject.prototype.traverse= function ( callback ) {

    callback( this );

    for ( var i = 0, l = this.children.length; i < l; i ++ ) {

        this.children[ i ].traverse( callback );

    }

}

StageObject.prototype.getObjectById=function ( id, recursive ) {

    for ( var i = 0, l = this.children.length; i < l; i ++ ) {

        var child = this.children[ i ];

        if ( child.id === id ) {

            return child;

        }

        if ( recursive === true ) {

            child = child.getObjectById( id, recursive );

            if ( child !== undefined ) {

                return child;

            }

        }

    }

    return undefined;

}

StageObject.prototype.getObjectByName= function ( name, recursive ) {

    for ( var i = 0, l = this.children.length; i < l; i ++ ) {

        var child = this.children[ i ];

        if ( child.name === name ) {

            return child;

        }

        if ( recursive === true ) {

            child = child.getObjectByName( name, recursive );

            if ( child !== undefined ) {

                return child;

            }

        }

    }

    return undefined;

}

StageObject.prototype.getChildByName= function ( name, recursive ) {

    return this.getObjectByName( name, recursive );

}

StageObject.prototype.getDescendants=function ( array ) {

    if ( array === undefined ) array = [];

    Array.prototype.push.apply( array, this.children );

    for ( var i = 0, l = this.children.length; i < l; i ++ ) {

        this.children[ i ].getDescendants( array );

    }

    return array;

}

StageObject.prototype.updateMatrix=function () {

    mat4.identity(this.modelMatrix);
    mat4.fromQuat(this.modelMatrix,this.quaternion);
    mat4.scale(this.modelMatrix,this.modelMatrix,this.scale);
    this.modelMatrix[12]=this.position[0];
    this.modelMatrix[13]=this.position[1];
    this.modelMatrix[14]=this.position[2];
    this.matrixWorldNeedsUpdate = true;

}
StageObject.prototype.update=function(steps){
    this.updateMatrixWorld();

}
StageObject.prototype.updateMatrixWorld=function ( force ) {

    if ( this.matrixAutoUpdate === true ) this.updateMatrix();

    if ( this.matrixWorldNeedsUpdate === true || force === true ) {

        if ( this.parent === undefined ) {

            mat4.copy(this.matrixWorld, this.modelMatrix );

        } else {

            mat4.mul(this.matrixWorld,this.parent.matrixWorld,this.modelMatrix);
        }
        this.matrixWorldNeedsUpdate = false;

        force = true;

    }

    // update children

    for ( var i = 0, l = this.children.length; i < l; i ++ ) {

        this.children[ i ].updateMatrixWorld( force );

    }

}

