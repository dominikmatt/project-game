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

                uvLayer = data.uvs[ i ];

                uvIndex = faces[ offset ++ ];



                geometry.faceUvs[ i ][ fi ] = uvIndex;

            }

        }
        //Just iterating and moving offset index forward. UV not relevant to this chapter.
        if ( hasFaceVertexUv ) {

            for ( i = 0; i < nUvLayers; i++ ) {


                uvLayer = data.uvs[ i ];

                uvs = [];

                var aVertexIndices=["a","b","c","d"];
                for ( j = 0; j < nVertices; j ++ ) {

                    uvIndex = faces[ offset ++ ];

                    //u = uvLayer[ uvIndex * 2 ];
                    //v = uvLayer[ uvIndex * 2 + 1 ];

                    uvs[ aVertexIndices[j] ] = uvIndex;

                }

                geometry.faceVertexUvs[ i ][ fi ] = uvs;
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
    if(data.bones && data.bones.length>0){
    parseSkin(data,geometry);
    }
    
    geometry.verticesFromFaceUvs(data.vertices,data.uvs,0);

    geometry.indicesFromFaces();

    if(geometry.vertices.length==0){

        geometry.vertices=vertices;

    }
    if(data.normals && data.normals.length>0){

        geometry.morphedVertexNormalsFromObj();
    }
    else{
        geometry.calculateVertexNormals();
    }
    //geometry.meshFromFaces();


    return geometry;
}
function parseSkin(data,geometry) {

    var i, l, x, y, z, w, a, b, c, d;

    if ( data.skinWeights ) {

        for ( i = 0, l = data.skinWeights.length; i < l; i += 2 ) {

            x = data.skinWeights[ i     ];
            y = data.skinWeights[ i + 1 ];
            z = 0;
            w = 0;

            geometry.skinWeights.push(x);
            geometry.skinWeights.push(y);
            geometry.skinWeights.push(z);
            geometry.skinWeights.push(w);



        }

    }

    if ( data.skinIndices ) {

        for ( i = 0, l = data.skinIndices.length; i < l; i += 2 ) {

            a = data.skinIndices[ i     ];
            b = data.skinIndices[ i + 1 ];
            c = 0;
            d = 0;

            geometry.skinIndices.push(a);
            geometry.skinIndices.push(b);
            geometry.skinIndices.push(c);
            geometry.skinIndices.push(d);


        }

    }

    geometry.bones = data.bones;
    geometry.animation = data.animation;

}


