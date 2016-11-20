PlaneGeometry = inherit(Geometry, function (width, height, widthOfSegments, heightOfSegments,calculateHeight)
{

    superc(this);
    this.width = width;
    this.height = height;

    this.widthOfSegments = widthOfSegments || 1;
    this.heightOfSegments = heightOfSegments || 1;

    var i, j;
    var widthHalf = width / 2;
    var heightHalf = height / 2;

    var gridX = this.widthOfSegments;
    var gridZ = this.heightOfSegments;

    var gridXN = gridX + 1;
    var gridZN = gridZ + 1;

    var segmentWidth = this.width / gridX;
    var segmentHeight = this.height / gridZ;

    var normal = vec3.fromValues( 0, 0, 1 );
    this.heights=[[]];
    this.calculateHeight=calculateHeight;
    for ( i = 0; i < gridZN; i ++ ) {
        this.heights[i]=[]
        for ( j = 0; j < gridXN; j ++ ) {

            var x = j * segmentWidth - widthHalf;
            var y = i * segmentHeight - heightHalf;

            this.vertices.push(x);
            this.vertices.push(- y);
            if(this.calculateHeight){
                this.heights[i][j]=this.calculateHeight(x,-y);
                this.vertices.push(this.heights[i][j]);
            }else{
                this.heights[i][j]=0;
            this.vertices.push(0);
        }

        }

    }

    var faceUVIndex=0;
    var faceIndex=0;
    this.faceVertexUvs[0]=[];
    var uvs=[[]];
    uvs[0]=[];
    for ( i = 0; i < gridZ; i ++ ) {

        for ( j = 0; j < gridX; j ++ ) {

            var a = j + gridXN * i;
            var b = j + gridXN * ( i + 1 );
            var c = ( j + 1 ) + gridXN * ( i + 1 );
            var d = ( j + 1 ) + gridXN * i;

            var uva = vec2.fromValues( j / gridX, 1 - i / gridZ );
            var uvb = vec2.fromValues( j / gridX, 1 - ( i + 1 ) / gridZ );
            var uvc = vec2.fromValues( ( j + 1 ) / gridX, 1 - ( i + 1 ) / gridZ );
            var uvd = vec2.fromValues( ( j + 1 ) / gridX, 1 - i / gridZ );

            var face = new Face();
            face.a=a;
            face.b=b;
            face.c=d;
            face.vertexNormals=[];
            face.vertexNormals["a"]=vec3.clone(normal);
            face.vertexNormals["b"]=vec3.clone(normal);
            face.vertexNormals["c"]=vec3.clone( normal);

            this.faces.push( face );

            uvs[0].push(uva[0]);
            uvs[0].push(uva[1]);
            uvs[0].push(uvb[0]);
            uvs[0].push(uvb[1]);
            uvs[0].push(uvc[0]);
            uvs[0].push(uvc[1]);
            uvs[0].push(uvd[0]);
            uvs[0].push(uvd[1]);
            this.faceVertexUvs[0][faceIndex]=[];
            this.faceVertexUvs[0][faceIndex]["a"]= faceUVIndex;
            this.faceVertexUvs[0][faceIndex]["b"]= faceUVIndex+1;
            this.faceVertexUvs[0][faceIndex]["c"]= faceUVIndex+3;
            faceIndex=faceIndex+1;


            face = new Face();
            face.a=b;
            face.b=c;
            face.c=d;
            face.vertexNormals=[];
            face.vertexNormals["a"]=vec3.clone(normal);
            face.vertexNormals["b"]=vec3.clone(normal);
            face.vertexNormals["c"]=vec3.clone(normal);

            this.faces.push( face );

            this.faceVertexUvs[0][faceIndex]=[];
            this.faceVertexUvs[0][faceIndex]["a"]= faceUVIndex+1;
            this.faceVertexUvs[0][faceIndex]["b"]= faceUVIndex+2;
            this.faceVertexUvs[0][faceIndex]["c"]= faceUVIndex+3;
            faceIndex=faceIndex+1;
            faceUVIndex=faceUVIndex+4;



        }

    }
    this.verticesFromFaceUvs(this.vertices,uvs,0);
    this.indicesFromFaces();
    this.morphedVertexNormalsFromObj();


});
PlaneGeometry.prototype.getHeights=function(i,j){
    return this.heights[i][j];
}


