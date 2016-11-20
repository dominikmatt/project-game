LeftHand= inherit(StageObject, function (){
    superc(this);
    this.rotations=[];
    for(var j=90.0;j>=75.0;j=j-1){
        this.rotations.push((j*22/7)/180);
    }
    this.visible=false;
    this.counter=0;
    this.grenadeCallback=null;
});

LeftHand.prototype.update=function() {
    if(this.counter<this.rotations.length) {
      var mMatrix=mat4.clone(this.camera.viewMatrix);
      mat4.invert(mMatrix,mMatrix);
      mat4.translate(this.modelMatrix,mMatrix,vec3.fromValues(-1.5,-3,-6));
    mat4.rotateX(this.modelMatrix,this.modelMatrix,this.rotations[this.counter]);
        this.counter=this.counter+1;

    }else{
        this.counter=0;
        this.visible=false;
        this.grenadeCallback();
    }


}
