Bullet= inherit(StageObject, function (){
    superc(this);
    this.visible=false;
    this.positions=[];
    this.initialModelMatrix=mat4.create();
    this.steps=1;
    this.counter=0;


});
Bullet.prototype.initialize=function() {
    var mMatrix=mat4.clone(this.camera.viewMatrix);

    mat4.invert(this.initialModelMatrix,mMatrix);
    var count=200/this.steps;
    this.positions=[];
    for(var i=0;i<count;++i){
     this.positions.push(this.calculatePosition(i*this.steps));
    }
    this.counter=0;
    this.visible=true;
    if(this.rigidBody){
    this.initializePosition();
    this.system.addBody(this.rigidBody);
    }

    //mat4.translate(this.modelMatrix,mMatrix,vec3.fromValues(0,-3,-8));
}
Bullet.prototype.calculatePosition=function(s){
    var newPosition = [ 0,-2,-16-s];
    return vec3.fromValues(newPosition[0],newPosition[1],newPosition[2])
}
Bullet.prototype.initializePosition=function(){
    var mat=mat4.create();
    mat4.translate(mat,this.initialModelMatrix,this.positions[this.counter]);
    var newPos=jigLib.GLMatrix.multiplyVec3(mat,[0,0,-1]);
    this.rigidBody.moveTo(jigLib.Vector3DUtil.create(newPos[0],newPos[1],newPos[2]));
}

Bullet.prototype.update=function() {
     if(this.rigidBody){
        if(this.counter<this.positions.length-1){
          this.counter=this.counter+1;
          this.initializePosition();

        }
          var pos=this.rigidBody.get_currentState().position;
          mat4.identity(this.modelMatrix);
          mat4.translate(this.modelMatrix,this.modelMatrix,vec3.fromValues(pos[0],pos[1],pos[2]));
          if(this.rigidBody.collisions.length>0){
              this.visible=false;
              console.log(this.rigidBody.collisions);
              this.system.removeBody(this.rigidBody);
              this.rigidBody.collisions=[];

          }

            mat4.scale(this.matrixWorld,this.modelMatrix,vec3.fromValues(5,5,5));
     }else{

         if(this.counter<this.positions.length){
             mat4.translate(this.modelMatrix,this.initialModelMatrix,this.positions[this.counter]);
             this.counter=this.counter+1;
         }
         else{
             this.visible=false;
         }
         mat4.scale(this.matrixWorld,this.modelMatrix,vec3.fromValues(5,5,5));

     }
}
Bullet.prototype.clone=function(){
    var bullet=new Bullet();
    bullet.geometry=this.geometry.clone();

    var i;
    for(i=0;i<this.diffuseColor.length;++i){
        bullet.diffuseColor[i]=this.diffuseColor[i];
    }
    for(i=0;i<this.ambientColor.length;++i){
        bullet.ambientColor[i]=this.ambientColor[i];
    }
    for(i=0;i<this.specularColor.length;++i){
        bullet.specularColor[i]=this.specularColor[i];
    }
    bullet.name=this.name;
    bullet.quaternion=quat.clone(this.quaternion);
    bullet.materialFile=this.materialFile;
    bullet.textureIndex=this.textureIndex;
    bullet.loaded=true;
    bullet.visible=false;
    return bullet;

}



