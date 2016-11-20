Grenade= inherit(StageObject, function (){
    superc(this);
    this.positions=[];
    this.counter=0;
    this.visible=false;
    this.initialModelMatrix=mat4.create();
    this.counter=0;
});
Grenade.prototype.initialize=function(positions) {
    var mMatrix=mat4.clone(this.camera.viewMatrix);
    mat4.invert(this.initialModelMatrix,mMatrix);
    this.initializePhysics();
    this.counter=0;
    this.visible=true;

}
Grenade.prototype.initializePhysics=function(){
    var cube = new jigLib.JSphere( null, 10 );
    cube.set_mass(10);
    this.rigidBody=cube;
    var newPos=jigLib.GLMatrix.multiplyVec3(this.initialModelMatrix,[-1.5,-2,-10]);
    this.rigidBody.moveTo(jigLib.Vector3DUtil.create(newPos[0],newPos[1],newPos[2]));
    var pos = this.rigidBody.get_currentState().position;
    this.extractOrientation(this.initialModelMatrix);
   // var force=jigLib.GLMatrix.multiplyVec3(this.initialModelMatrix,[0,300,-1200]);
var impulse=jigLib.GLMatrix.multiplyVec3(this.initialModelMatrix,[0,180,-800]);

    //this.rigidBody.addWorldForce(jigLib.Vector3DUtil.create(force[0],force[1],force[2]),jigLib.Vector3DUtil.create(pos.x,pos.y,pos.z));
    this.rigidBody.applyWorldImpulse(jigLib.Vector3DUtil.create(impulse[0],impulse[1],impulse[2]),jigLib.Vector3DUtil.create(pos.x,pos.y,pos.z));
   
     this.system.addBody(this.rigidBody);
    this.rigidBody.addEventListener(jigLib.JCollisionEvent.COLLISION,function(event){
        console.log(event);
        //event.collisionBody
        //event.collisionInfo
    });
}
Grenade.prototype.extractOrientation=function(matrix){
    matrix[12]=0;
    matrix[13]=0;
    matrix[14]=0;
        
}
Grenade.prototype.update=function() {

    if(this.rigidBody){
        var pos = this.rigidBody.get_currentState().position;
        var dir = this.rigidBody.get_currentState().get_orientation().glmatrix;
        mat4.identity(this.modelMatrix);
        this.location=vec3.fromValues(pos[0], pos[1], pos[2]);
        mat4.translate(this.modelMatrix,this.modelMatrix, this.location);

        mat4.scale(this.modelMatrix,this.modelMatrix,vec3.fromValues(5,5,5));
        if(this.rigidBody.collisions.length>0){
            this.system.removeBody(this.rigidBody);
             console.log(this.rigidBody.collisions);
            if(this.callBack){
            this.callBack(this.rigidBody,this.rigidBody.collisions);
            }

            this.visible=false;
            this.rigidBody.collisions=[];



        }

    }

}