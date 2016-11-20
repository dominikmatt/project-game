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

    constructor: Face,
     clone: function () {

        var face = new Face(this.a, this.b, this.c );
        if(!(this.normal===undefined))
        face.normal=vec3.clone(this.normal );
        face.colorIndex= this.colorIndex;


        face.materialIndex = this.materialIndex;

        var i;

        for ( i = 0; i < this.vertexNormals.length; ++i){

            face.vertexNormals[ i ] = vec3.clone(this.vertexNormals[ i ]);
        }



        for ( i = 0; i<this.vertexColors.length;++i ){
            face.vertexColors[ i ] = this.vertexColors[ i ];

        }

        return face;

    }

};


