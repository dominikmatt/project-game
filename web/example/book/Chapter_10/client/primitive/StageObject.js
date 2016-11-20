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
    this.boundingBox=null;
    this.boundingSphere=null;
    this.min=vec3.create();// for bounding box calculations
    this.max=vec3.create();//for bounding box calculations
    this.center=vec3.create();// for bounding sphere calculations
    this.radius=0.0;   // for bounding sphere calculations
    this.isPicked=false;
};

StageObject.prototype.calculateBoundingBox=function (){
           if(this.geometry.vertices.length>0){
           var point=vec3.fromValues(this.geometry.vertices[0],this.geometry.vertices[1],this.geometry.vertices[2]);
            vec3.copy(this.min, point );
            vec3.copy(this.max, point );
            for ( var i = 3; i < this.geometry.vertices.length;  i=i+3) {
                point=vec3.fromValues(this.geometry.vertices[i],this.geometry.vertices[i+1],this.geometry.vertices[i+2])
                if ( point[0] < this.min[0] ) {

                    this.min[0] = point[0];

                } else if ( point[0] > this.max[0] ) {

                    this.max[0] = point[0];

                }

                if ( point[1] < this.min[1] ) {

                    this.min[1] = point[1];

                } else if ( point[1] > this.max[1] ) {

                    this.max[1] = point[1];

                }

                if ( point[2] < this.min[2] ) {

                    this.min[2] = point[2];

                } else if ( point[2] > this.max[2] ) {

                    this.max[2] = point[2];

                }

            }
           }

}
StageObject.prototype.calculateCenter=function (){
    var center=vec3.create();
    vec3.add(center,this.min,this.max);
    vec3.scale(center,center,0.5);
    return center;

}
StageObject.prototype.initializePhysics=function(sphere){
    if(sphere){
        this.calculateBoundingSphere();
         this.rigidBody= new jigLib.JSphere(null,this.radius);
        this.rigidBody.set_mass(this.radius*this.radius*this.radius);
    }else{
            this.calculateBoundingBox();
         var subVector=vec3.create();
         vec3.sub(subVector,this.max,this.min);
        this.rigidBody=new jigLib.JBox(null,Math.abs(subVector[0]),Math.abs(subVector[2]),Math.abs(subVector[1]));
        this.rigidBody.set_mass(Math.abs(subVector[0])*Math.abs(subVector[2])*Math.abs(subVector[1]));

    }
    this.rigidBody.moveTo(jigLib.Vector3DUtil.create(this.position[0],this.position[1],this.position[2]));
    var matrix=mat4.create();
    mat4.fromQuat(matrix,this.quaternion);
    var orient=new jigLib.Matrix3D(matrix);
    this.rigidBody.setOrientation(orient);
    this.rigidBody.set_movable(false);

    this.system.addBody(this.rigidBody);


}
StageObject.prototype.calculateBoundingSphere=function (){
            this.calculateBoundingBox();
            this.center=this.calculateCenter();
            var squaredRadius=this.radius*this.radius;
            for ( var i = 0; i < this.geometry.vertices.length;  i=i+3) {
                var point=vec3.fromValues(this.geometry.vertices[i],this.geometry.vertices[i+1],this.geometry.vertices[i+2]);
                squaredRadius=Math.max(squaredRadius,vec3.squaredDistance(this.center,point));
            }
            this.radius=Math.sqrt(squaredRadius);
}

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
    if(this.rigidBody&&this.rigidBody.get_movable()){
        var pos=this.rigidBody.get_currentState().position;
        this.position=vec3.fromValues(pos[0],pos[1],pos[2]);

        mat4.copy(this.modelMatrix,this.rigidBody.get_currentState()._orientation.glmatrix);
    }else{
        mat4.identity(this.modelMatrix);
        mat4.fromQuat(this.modelMatrix,this.quaternion);

    }
    mat4.scale(this.modelMatrix,this.modelMatrix,this.scale);
    this.modelMatrix[12]=this.position[0];
    this.modelMatrix[13]=this.position[1];
    this.modelMatrix[14]=this.position[2];
    this.matrixWorldNeedsUpdate = true;

}
StageObject.prototype.update=function(steps){
    this.updateMatrixWorld(true);

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

