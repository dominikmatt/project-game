RightHand= inherit(StageObject, function (){
    superc(this);
});
RightHand.prototype.update=function() {
      var mMatrix=mat4.clone(this.camera.viewMatrix);
      mat4.invert(mMatrix,mMatrix);
      mat4.translate(this.modelMatrix,mMatrix,vec3.fromValues(0,-3,-8));


}
