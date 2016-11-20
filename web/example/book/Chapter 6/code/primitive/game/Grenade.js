Grenade= inherit(StageObject, function (){
    superc(this);
    this.positions=[];
    this.counter=0;
    this.visible=false;
    this.initialModelMatrix=mat4.create();
    this.explosionCallBack=null;
});
Grenade.prototype.initialize=function(positions) {
    var mMatrix=mat4.clone(this.camera.viewMatrix);

    mat4.invert(this.initialModelMatrix,mMatrix);

    this.counter=0;
    this.visible=true;
    this.positions=positions;

    //mat4.translate(this.modelMatrix,mMatrix,vec3.fromValues(0,-3,-8));
}
Grenade.prototype.update=function() {

    if(this.counter<this.positions.length-1){
        mat4.translate(this.modelMatrix,this.initialModelMatrix,this.positions[this.counter]);
        this.counter=this.counter+1;
    }
    else{
        this.visible=false;
        if(this.explosionCallBack!=null){
            this.explosionCallBack(this.modelMatrix);
        }

    }

}