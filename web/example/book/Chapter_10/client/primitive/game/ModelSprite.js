ModelSprite= inherit(Sprite, function (model,cam){
    superc(this);
    this.model=model;
    this.camera=cam;
    this.scale=vec3.fromValues(8,8,8);
    //The relative values to the model position
    this.deltaX=0;
    this.deltaY=0;
    this.deltaZ=0;

});

ModelSprite.prototype.update=function(){
    mat4.invert(this.matrixWorld,this.camera.viewMatrix);
    mat4.scale(this.matrixWorld,this.matrixWorld,this.scale);

    this.matrixWorld[12]=this.model.position[0]+this.deltaX;
    this.matrixWorld[13]=this.model.position[1]+this.deltaY;
    this.matrixWorld[14]=this.model.position[2]+this.deltaZ;


}
