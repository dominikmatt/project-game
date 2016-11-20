Geometry = function () {

   this.vertices = [];
    this.uvs=[[]];
	this.colors = [];  
    this.normals = []; 
    this.indices=[];
	this.faces = [];
	this.faceUvs = [[]];
	this.faceVertexUvs = [[]];
    this.textureCoordinates=[];
    this.materials=[];
};
Geometry.prototype = {
    constructor: Geometry,
    indicesFromFaces:function (){
    
    for(var i=0;i<this.faces.length;++i){
        this.indices.push(this.faces[i].a);
        this.indices.push(this.faces[i].b);
        this.indices.push(this.faces[i].c);

    }
    
    },
    /*verticesFromFaceUvs:function(vertices,uvs,materialIndex){
        var vertexVectors=[];
        var redundantVertexVectors=[];  //will hold the indexes to the vertex array
        var redundantUVs[];             //Will hold the indexes to the uv array
        //Create vector vertex from vertices for easy indexing
        for(var i=0;i<vertices.length;i=i+3){
            var vector=vec3.fromValues(vertices[i],vertices[i+1],vertices[i+2]);
            vertexVectors.push(vector);
        }
        // One faceVertexUV corresponds to one face
        for(var i=0;i<this.faceVertexUvs[materialIndex].length;++i)
        {
            var face=this.faces[i];  //Pick one face
            var textureIndices=this.faceVertexUvs[materialIndex][i]; //Pick the corresponding vertexUV map
            var aVertexIndices=["a","b","c"];
            for(var i=0;i<aVertexIndices.length;++i)
            {
                var aVertexIndex=aVertexIndices[i];
                redundantVertexVectors.push(face[aVertexIndex]);  // For each vertex in face, copy the vertex to the vertex redundant array.
                redundantUVs.push(textureIndices[aVertexIndex]);  // For each vertex in face, copy the vertexUV map to the uv redundant array.
            }
        }
        for(var i=0;i<redundantVertexVectors.length;++i)
        {
            var vector=vertexVectors[redundantVertexVectors[i]];
            this.vertices.push(vector[0]);   //Copy X value of the vertex to vertices
            this.vertices.push(vector[1]);   //Copy Y value of the vertex to vertices
            this.vertices.push(vector[2]);   //Copy Z value of the vertex to vertices
            this.uvs.push(uvs[redundantUVs[i]*2]); //Copy s value from the UV array. Since uv=[s0,t0, s1,t1, s2,t2  ]
            this.uvs.push(uvs[redundantUVs[i]*2+1]);
            this.indices.push(i+1);   //indices=[1,2,3, 4,5,6, 7,8,9,  ...............]

     }

    }, */
    verticesFromFaceUvs: function(vertices, uvs, materialIndex) {
        var vertexVectors = [];
        var redundantVertexVectors = [];

        var vertexCovered = [];
        //Copy vertices to a vec3 array
        for (var i = 0; i < vertices.length; i = i + 3) {
            var vector = vec3.fromValues(vertices[i], vertices[i + 1], vertices[i + 2]);
            vertexVectors.push(vector);
        }
        var count = 0;
        //Iterating over all uv indices for each vertex in a face.    
        for (var i = 0; i < this.faceVertexUvs[materialIndex].length; ++i) {
            var face = this.faces[i];
            var textureIndices = this.faceVertexUvs[materialIndex][i];
            var aVertexIndices = ["a", "b", "c"];
            //Iterating over the each vertex of the face.
            for (var j = 0; j < aVertexIndices.length; ++j) {
                var aVertexIndex = aVertexIndices[j];
                //If the new vertex corresponding to texture co-ordinate points to same vertex as in redundant array or the coresponding vertex is not define din the redundante array. 
                if (redundantVertexVectors[textureIndices[aVertexIndex]] == face[aVertexIndex] || redundantVertexVectors[textureIndices[aVertexIndex]] === undefined) {
                    redundantVertexVectors[textureIndices[aVertexIndex]] = face[aVertexIndex];
                    face[aVertexIndex] = textureIndices[aVertexIndex];
                }
                else {
                // The texture co-ordidanate holds the index of a different vertex duplicate the uv co-ordinate
                    uvs[materialIndex].push(uvs[materialIndex][textureIndices[aVertexIndex] * 2]);
                    uvs[materialIndex].push(uvs[materialIndex][textureIndices[aVertexIndex] * 2 + 1]);
                    var newIndex = Math.floor(uvs[materialIndex].length / 2) - 1;
                    redundantVertexVectors[newIndex] = face[aVertexIndex];
                    face[aVertexIndex] = newIndex;
                    textureIndices[aVertexIndex] = newIndex;

                }
            }
        }
        for (var i = 0; i < redundantVertexVectors.length; ++i) {
            var vector = vertexVectors[redundantVertexVectors[i]];
            this.vertices.push(vector[0]);
            this.vertices.push(vector[1]);
            this.vertices.push(vector[2]);
        }
        this.uvs = uvs;
    },
    morphedVertexNormalsFromObj:function(){
        var vertexVectors=[];
        var normalVectors=[];

        for(var i=0;i<this.faces.length;i=i+1){
            if(!(this.faces[i].normal==undefined)&&this.faces[i].vertexNormals.length==0){
                this.faces[i].vertexNormals["a"]=vec3.clone(this.faces[i].normal);
                this.faces[i].vertexNormals["b"]=vec3.clone(this.faces[i].normal);
                this.faces[i].vertexNormals["c"]=vec3.clone(this.faces[i].normal);
            }
            try{
            if(normalVectors[this.faces[i].a]===undefined)
            {
                normalVectors[this.faces[i].a]=vec3.clone(this.faces[i].vertexNormals["a"]);
            }
            else{
                vec3.add(normalVectors[this.faces[i].a],normalVectors[this.faces[i].a],this.faces[i].vertexNormals["a"])
            }
            if(normalVectors[this.faces[i].b]===undefined){
                normalVectors[this.faces[i].b]=vec3.clone(this.faces[i].vertexNormals["b"]);
            }
            else{
                vec3.add(normalVectors[this.faces[i].b],normalVectors[this.faces[i].b],this.faces[i].vertexNormals["b"])
            }
            if(normalVectors[this.faces[i].c]===undefined){
                normalVectors[this.faces[i].c]=vec3.clone(this.faces[i].vertexNormals["c"]);
            }
            else{
                vec3.add(normalVectors[this.faces[i].c],normalVectors[this.faces[i].c],this.faces[i].vertexNormals["c"])
            }
            }catch(e){
                alert(e);
            }

        }
        this.normals=[];
        for(var j=0;j<normalVectors.length;j=j+1){
            vec3.normalize(normalVectors[j],normalVectors[j]);
            this.normals.push(normalVectors[j][0]);
            this.normals.push(normalVectors[j][1]);
            this.normals.push(normalVectors[j][2]);

        }


    },
    calculateVertexNormals:function(){
    var vertexVectors=[];
    var normalVectors=[];

    var j;
    for(var i=0;i<this.vertices.length;i=i+3){
        var vector=vec3.fromValues(this.vertices[i],this.vertices[i+1],this.vertices[i+2]);
        var normal=vec3.create();//Intiliazed normal array
        normalVectors.push(normal);
        vertexVectors.push(vector);
    }
    try{
        for(j=0;j<this.indices.length;j=j+3)//Since we are using triads of indices to represent one primitive
        {

            //v1-v0
            var vector1=vec3.create();
            vec3.subtract(vector1,vertexVectors[this.indices[j+1]],vertexVectors[this.indices[j]]);
            //v2-v1
            var vector2=vec3.create();
            vec3.subtract(vector2,vertexVectors[this.indices[j+2]],vertexVectors[this.indices[j+1]]);
            var normal=vec3.create();
            //cross product of two vector
            vec3.cross(normal, vector1, vector2);
            //Since the normal calculated from three vertices is same for all the three vertices(same face/surface), the contribution from each normal to the corresponding vertex  is the same
            vec3.add(normalVectors[this.indices[j]],normalVectors[this.indices[j]],normal);
            vec3.add(normalVectors[this.indices[j+1]],normalVectors[this.indices[j+1]],normal);
            vec3.add(normalVectors[this.indices[j+2]],normalVectors[this.indices[j+2]],normal);

        }
        }catch(e){
            alert(e);
        }
        for(var j=0;j<normalVectors.length;j=j+1){
        vec3.normalize(normalVectors[j],normalVectors[j]);
        this.normals.push(normalVectors[j][0]);
        this.normals.push(normalVectors[j][1]);
        this.normals.push(normalVectors[j][2]);

        }


    },
     clone:function(){
        var geometry=new Geometry();
        var i,j;
        for(i=0;i<this.vertices.length;++i){
            geometry.vertices[i]=this.vertices[i];
        }
        for(i=0;i<this.faces.length;++i){
            geometry.faces[i]=this.faces[i].clone();
        }
        for(i=0;i<this.uvs.length;++i){
            for(j=0;j<this.uvs[i].length;j) geometry.uvs[i][j]=this.uvs[i][j];
        }
        for(i=0;i<this.indices.length;++i){
            geometry.indices[i]=this.indices[i];
        }
        for(i=0;i<this.colors.length;++i){
            geometry.colors[i]=this.colors[i];
        }
        for(i=0;i<this.normals.length;++i){
            geometry.normals[i]=this.normals[i];
        }
        for(i=0;i<this.textureCoordinates.length;++i){
            geometry.textureCoordinates[i]=this.textureCoordinates[i];
        }
        for(i=0;i<this.faceUvs.length;++i){
            for(j=0;j<this.faceUvs[i].length;++j) geometry.faceUvs[i][j]=this.uvs[i][j];
        }
        for(i=0;i<this.faceVertexUvs.length;++i){
            for(j=0;j<this.faceVertexUvs[i].length;++j) geometry.faceVertexUvs[i][j]=this.faceVertexUvs[i][j];
        }
        geometry.materials=jQuery.extend(true, {}, this.materials);
        return geometry;
    }
};


