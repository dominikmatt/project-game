Face = function ( a, b, c, normal, color, materialIndex ) {

    this.a = a;
    this.b = b;
    this.c = c;

    this.normal =  normal ;
    this.vertexNormals = [ ];

    this.vertexColors = color instanceof Array ? color : [];
    this.colorIndex = color;

    this.vertexTangents = [];

    this.materialIndex = materialIndex !== undefined ? materialIndex : 0;



};
Face.prototype = {

    constructor: Face
};


