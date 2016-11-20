Explosion= inherit(StageObject, function (){
    superc(this);
    this.textureIndices=[];
    this.counter=0;
    this.visible=false;
    this.frames=0;

});
Explosion.prototype.initialize=function(modelMatrix) {
    this.matrixWorld=mat4.clone(modelMatrix);
    this.counter=0;
    this.textureIndex=this.textureIndices[0];
    this.visible=true;
    this.frames=0;

    //mat4.translate(this.modelMatrix,mMatrix,vec3.fromValues(0,-3,-8));
}
Explosion.prototype.update=function() {

    if(this.counter<this.textureIndices.length){
        if(this.frames>=2){
        this.textureIndex=this.textureIndices[this.counter];
        this.counter=this.counter+1;
        this.frames=0;
        }else{

            this.frames=this.frames+1;
        }
    }
    else{
        this.visible=false;
        this.counter=0;
    }

}