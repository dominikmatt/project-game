Plane= inherit(StageObject, function (width, height, widthOfSegments, heightOfSegments,textureName,modifyHeight){
    superc(this);
    this.geometry=null;
    this.width=width;
    this.height=height;
    this.ws=widthOfSegments;
    this.wh=heightOfSegments;
    if(modifyHeight)
        this.geometry=new PlaneGeometry(width, height, widthOfSegments, heightOfSegments,this.modifyGeometry);
    else
        this.geometry=new PlaneGeometry(width, height, widthOfSegments, heightOfSegments,null);

    this.materialFile=textureName;//"terrain_1024.jpg";


});

Plane.prototype.initializeRigidBody=function(){
    var pos=jigLib.Vector3DUtil.create( 0, 0,0,0 );
    var matrix3D = new jigLib.Matrix3D();
    matrix3D.appendRotation(0, jigLib.Vector3DUtil.X_AXIS);
    /*var vertexTriangles=[];
    for(var i=0;i<this.geometry.faces.length;++i){
        vertexTriangles[i]=[];
        vertexTriangles[i][0] = this.geometry.faces[i]["a"];
        vertexTriangles[i][1] = this.geometry.faces[i]["b"];
        vertexTriangles[i][2] = this.geometry.faces[i]["c"];
    }
    var vertices=[];
    for(var i=0;i<this.geometry.vertices.length;i=i+3){
        var vertex=[ this.geometry.vertices[i], this.geometry.vertices[i+1],this.geometry.vertices[i+2]];
        vertices.push(vertex);
    } */
    var terrain=new TerrainData(this.width,this.height,this.ws,this.wh,this.geometry);
    this.rigidBody=new jigLib.JTerrain(terrain);
    //this.rigidBody.yUp=true;
    //this.rigidBody.createMesh(vertices,vertexTriangles);
    this.rigidBody.moveTo(pos);
    this.rigidBody.setOrientation(matrix3D);


}
Plane.prototype.modifyGeometry=function(x,y){
        if((x>=0&&x<100)&&(y>=0&&y<100)){
            return 25;
        }
        else if((x>=100&&x<150)&&(y>=100&&y<150)){
            return 20;
        }
        else if((x>=150&&x<200)&&(y>=150&&y<200)){
            return 15;
        }
        else if((x>=200&&x<250)&&(y>=200&&y<250)){
            return 10;
        }
        else if((x>=250&&x<300)&&(y>=250&&y<300)){
            return 5;
        }
        else{
            return 0;
        }
}