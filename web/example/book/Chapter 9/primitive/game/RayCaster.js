RayCaster=function(SCREEN_WIDTH,SCREEN_HEIGHT,camera){
    this.camera=camera;
    this.screen_height=SCREEN_HEIGHT;
    this.screen_width=SCREEN_WIDTH;
    this.pickedObject=null;

  };
RayCaster.prototype.pickObject=function(x,y,system){
   
    var ray=this.makeRay(x,y);
    var directionVector=vec3.create();
    vec3.scale(directionVector,ray.directionVector,100)
    var segment=new jigLib.JSegment(ray.origin,directionVector);
    var out={};
    var cs=system.getCollisionSystem();
    if(cs.segmentIntersectGame(out, segment, null)){
       if(this.pickedObject){
           this.pickedObject.isPicked=false;
       }
       return out.rigidBody;
    }

}
RayCaster.prototype.makeRay=function(x,y){

    var x1 = ( x / this.screen_width )*2  - 1;
    var y1 = ( y / this.screen_height)*2  - 1;
    console.log("Hello");
    var startVector=vec3.fromValues(x1,y1,1);
    var originVector=vec3.fromValues(x1,y1,-1);
console.log("Hello1");
    var directionVector=this.camera.unProjectVector(startVector);
    var origin=this.camera.unProjectVector(originVector);
    console.log("Hello2");

    vec3.sub(directionVector,directionVector,origin);

    vec3.normalize(directionVector,directionVector);
    //vec3.scale(directionVector,directionVector,-1);
    return {origin: origin, directionVector: directionVector};;
    //vec3.scale(this.directionVector,this.directionVector,5);
}