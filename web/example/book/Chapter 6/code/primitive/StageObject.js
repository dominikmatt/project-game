StageObject=function(){
    this.name="";
    this.geometry=new Geometry();
    this.location=vec3.fromValues(0,0,0);
    this.rotationX=0.0;
    this.rotationY=0.0;
    this.rotationZ=0.0;
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
    this.visible=true;
    this.modelMatrix=mat4.create();

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
        stageObject.rotationX=this.rotationX;
        stageObject.name=this.name;
        stageObject.rotationY=this.rotationY;
        stageObject.rotationZ=this.rotationZ;
        stageObject.materialFile=this.materialFile;
        stageObject.textureIndex=this.textureIndex;
        stageObject.loaded=true;
        return stageObject;

    }
    StageObject.prototype.update=function(steps){
        mat4.identity(this.modelMatrix);

        mat4.translate(this.modelMatrix,this.modelMatrix, this.location);

        mat4.rotateX(this.modelMatrix,this.modelMatrix,this.rotationX);
        mat4.rotateY(this.modelMatrix,this.modelMatrix,this.rotationY);
        mat4.rotateZ(this.modelMatrix,this.modelMatrix,this.rotationZ);
    }
