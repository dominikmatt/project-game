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

    //mat4.translate(this.modelMatrix,mMatrix,vec3.fromValues(0,-3,-8));
}
Bullet.prototype.calculatePosition=function(s){
    var newPosition = [ 0,-2,-16-s];
    return vec3.fromValues(newPosition[0],newPosition[1],newPosition[2])
}
Bullet.prototype.update=function() {

      if(this.counter<this.positions.length){
      mat4.translate(this.modelMatrix,this.initialModelMatrix,this.positions[this.counter]);
      this.counter=this.counter+1;
      }
      else{
          this.visible=false;
      }
mat4.scale(this.modelMatrix,this.modelMatrix,vec3.fromValues(5,5,5));
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
    bullet.rotationX=this.rotationX;
    bullet.name=this.name;
    bullet.rotationY=this.rotationY;
    bullet.rotationZ=this.rotationZ;
    bullet.materialFile=this.materialFile;
    bullet.textureIndex=this.textureIndex;
    bullet.loaded=true;
    bullet.visible=false;
    return bullet;

}



