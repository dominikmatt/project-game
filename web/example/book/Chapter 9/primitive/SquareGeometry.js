SquareGeometry = inherit(Geometry, function ()
{

    superc(this);
    this.vertices=[
        -1.0,-1.0,0.0,//0
        1.0,-1.0,0.0,//1
        -1.0, 1.0,0.0,//2
        1.0, 1.0,0.0//3
    ];

    var uvs=[ 0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,1.0,1.0];
    var normal = vec3.fromValues( 0, 0, 1 );
    var face = new Face();
    face.a=0;
    face.b=1;
    face.c=2;
    face.vertexNormals=[];
    face.vertexNormals["a"]=vec3.clone(normal);
    face.vertexNormals["b"]=vec3.clone(normal);
    face.vertexNormals["c"]=vec3.clone( normal);
    this.faces.push( face );

    var face = new Face();
    face.a=2;
    face.b=1;
    face.c=3;
    face.vertexNormals=[];
    face.vertexNormals["a"]=vec3.clone(normal);
    face.vertexNormals["b"]=vec3.clone(normal);
    face.vertexNormals["c"]=vec3.clone( normal);
    this.faces.push( face );
   this.uvs[0]=uvs;
    this.indicesFromFaces();
    this.morphedVertexNormalsFromObj();


});


