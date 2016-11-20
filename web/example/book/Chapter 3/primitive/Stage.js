Stage = function (gl) {
    this.stageObjects=[];
    this.gl=gl;
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
    }

};