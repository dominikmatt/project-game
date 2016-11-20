Sphere= inherit(StageObject, function (){
    superc(this);


    this.visible=false;


});

Sphere.prototype.initializePhysics=function(){
    var sphere = new jigLib.JSphere( null, 20);
    sphere.set_mass(50);
    this.rigidBody=sphere;
    this.rigidBody.moveTo(jigLib.Vector3DUtil.create(0,100,120));
    this.system.addBody(this.rigidBody);
}
Sphere.prototype.update=function() {

     if(this.rigidBody){
        var pos = this.rigidBody.get_currentState().position;
        mat4.identity(this.modelMatrix);
        this.location=vec3.fromValues(pos[0], pos[1], pos[2]);
        mat4.translate(this.modelMatrix,this.modelMatrix, this.location);
         mat4.scale(this.matrixWorld,this.modelMatrix,vec3.fromValues(10,10,10));

     }   else{

         this.updateMatrixWorld();
     }

}