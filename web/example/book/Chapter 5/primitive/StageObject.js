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
};
StageObject.prototype = {
    constructor: StageObject,
    loadObject: function (data){

        this.geometry=parseJSON(data);

        this.name=data.metadata.sourceFile.split(".")[0];

            if(this.geometry.materials.length>0){
                if(!(this.geometry.materials[0].colorDiffuse===undefined))
                this.diffuseColor=this.geometry.materials[0].colorDiffuse;
                if(!(this.geometry.materials[0].colorAmbient===undefined))
                    this.ambientColor=this.geometry.materials[0].colorAmbient;
                if(!(this.geometry.materials[0].colorSpecular===undefined))
                    this.specularColor=this.geometry.materials[0].colorSpecular;

            }

    },
    createBuffers:function(gl){
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

    },
    clone:function(){
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
      stageObject.rotationY=this.rotationY;
        stageObject.rotationZ=this.rotationZ;
        stageObject.loaded=true;
        return stageObject;

    }
};
