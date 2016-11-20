Stage = function (gl) {
    this.stageObjects=[];
    this.gl=gl;
    this.textures=new Object(); //This will have texture index,filename,loaded img object,and texture object
};
Stage.prototype = {
    constructor: Stage,
    addModel:function(stageObject){

        if(!(this.gl===undefined))  {
            stageObject.createBuffers(this.gl);

        }
        this.stageObjects.push(stageObject);
    },
    getByName:function(name){
      var sceneObject=undefined;
      for(var i=0;i<this.stageObjects.length;++i){
          if(this.stageObjects[i].name==name){
            sceneObject=this.stageObjects[i];
            break;
          }
      }
      return sceneObject;
    },
    checkTexture:function(name){
        var flag=-1;
        for(var i=0;i<this.textures.length;++i){

            if(name==this.textures[i].fileName){
                flag=this.textures[i].index;
                break;
            }
        }
        return flag;
    },
    addTexture:function(index,name,img){
        var texture=new Object();
        texture.fileName=name;
        texture.img=img;
        texture.index=index;
        texture.texture=this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture.texture);

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, img);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        this.textures[index]=texture;

    }
};