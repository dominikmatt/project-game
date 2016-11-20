function isBitSet( value, position ) {

    return value & ( 1 << position );

}
function parseJSON(data){

      var geometry=new Geometry();;
    var i, j, fi,

        offset, zLength, nVertices,

        colorIndex, normalIndex, uvIndex, materialIndex,

        type,
        isQuad,
        hasMaterial,
        hasFaceUv, hasFaceVertexUv,
        hasFaceNormal, hasFaceVertexNormal,
        hasFaceColor, hasFaceVertexColor,

        vertex, face, color, normal,

        uvLayer, uvs, u, v,

        faces = data.faces,
        vertices = data.vertices,
        normals = data.normals,
        colors = data.colors,
        nUvLayers = 0;
        geometry.verticesFromFile=data.vertices;
    // disregard empty arrays

    for ( i = 0; i < data.uvs.length; i++ ) {

        if ( data.uvs[ i ].length ) nUvLayers ++;

    }
    
			
			for ( i = 0; i < nUvLayers; i++ ) {

				geometry.faceUvs[ i ] = [];
				geometry.faceVertexUvs[ i ] = [];

			} 


    offset = 0;
    zLength = faces.length;

    while ( offset < zLength ) {

        type = faces[ offset ++ ];
        

        isQuad              = isBitSet( type, 0 );
        hasMaterial         = isBitSet( type, 1 );
        hasFaceUv           = isBitSet( type, 2 );
        hasFaceVertexUv     = isBitSet( type, 3 );
        hasFaceNormal       = isBitSet( type, 4 );
        hasFaceVertexNormal = isBitSet( type, 5 );
        hasFaceColor	    = isBitSet( type, 6 );
        hasFaceVertexColor  = isBitSet( type, 7 );


        if ( isQuad ) {

            face = new Face();

            face.a = faces[ offset ++ ];
            face.b = faces[ offset ++ ];
            face.c = faces[ offset ++ ];
            face.d=faces[ offset ++ ];

            nVertices = 4;

        } else {

            face = new Face();

            face.a = faces[ offset ++ ];
            face.b = faces[ offset ++ ];
            face.c = faces[ offset ++ ];

            nVertices = 3;

        }

        if ( hasMaterial ) {

            materialIndex = faces[ offset ++ ];
            face.materialIndex = materialIndex;

        }

        //Just iterating and moving offset index forward. UV not relevant to this chapter.
        fi = geometry.faces.length;

        //Just iterating and moving offset index forward. UV not relevant to this chapter.

        if ( hasFaceUv ) {

            for ( i = 0; i < nUvLayers; i++ ) {

                uvIndex = faces[ offset ++ ];

            }

        }
        //Just iterating and moving offset index forward. UV not relevant to this chapter.
        if ( hasFaceVertexUv ) {

            for ( i = 0; i < nUvLayers; i++ ) {


                for ( j = 0; j < nVertices; j ++ ) {

                    uvIndex = faces[ offset ++ ];


                }
            }

        }
        if ( hasFaceNormal ) {

            normalIndex = faces[ offset ++ ] * 3;
            normal = vec3.fromValues(normals[ normalIndex ++ ],normals[ normalIndex ++ ],normals[ normalIndex ]);
            face.normal = normal;

        }

        if ( hasFaceVertexNormal ) {
            var aVertices=["a","b","c","d"]
            for ( i = 0; i < nVertices; i++ ) {
                var aVertex=aVertices[i];
                normalIndex = faces[ offset ++ ] * 3;
                normal = vec3.fromValues(normals[ normalIndex ++ ],normals[ normalIndex ++ ],normals[ normalIndex ]);
                face.vertexNormals[aVertex]= normal;

            }
        }


        if ( hasFaceColor ) {

            colorIndex = faces[ offset ++ ];

            face.colorIndex = colorIndex;

        }


        if ( hasFaceVertexColor ) {

            for ( i = 0; i < nVertices; i++ ) {

                colorIndex = faces[ offset ++ ];

                face.vertexColors.push( colorIndex );

            }

        }

        geometry.faces.push( face );


}
   geometry.materials=data.materials;

    geometry.indicesFromFaces();

    if(geometry.vertices.length==0){

        geometry.vertices=vertices;

    }
    if(data.normals.length>0){

        geometry.morphedVertexNormalsFromObj();
    }
    else{
        geometry.calculateVertexNormals();
    }
    //geometry.meshFromFaces();


    return geometry;
}
