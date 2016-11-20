Geometry = function () {

    this.vertices = [];
    this.verticesFromFile=[];
    this.uvsFromFile=[];

    this.uvs=[[]];
    this.colors = [];
    this.normals = [];
    this.indices=[];
    this.faces = [];
    this.faceUvs = [[]];
    this.faceVertexUvs = [[]];
    this.textureCoordinates=[];
    this.materials=[];
    this.skinWeights = [];
    this.skinIndices = [];
    this.bones = [];

    this.animation=[];

};

    Geometry.prototype.indicesFromFaces=function (){

        for(var i=0;i<this.faces.length;++i){
            this.indices.push(this.faces[i].a);
            this.indices.push(this.faces[i].b);
            this.indices.push(this.faces[i].c);

        }

    }
Geometry.prototype.meshFromFaces=function(){
        var redundantVertices=[];
        var newIndex=0;
        this.indices=[];
        this.normals=[];

        for(var i=0;i<this.faces.length;i=i+1){
            var aVertices=["a","b","c"];
            for(var j=0;j<3;++j){
                var aVertex=aVertices[j];

                if(!(this.faces[i].normal==undefined)&&this.faces[i].vertexNormals.length==0){
                    this.faces[i].vertexNormals[aVertex]=vec3.clone(this.faces[i].normal);
                }

                redundantVertices.push(this.verticesFromFile[this.faces[i][aVertex]*3]);
                redundantVertices.push(this.verticesFromFile[this.faces[i][aVertex]*3+1]);
                redundantVertices.push(this.verticesFromFile[this.faces[i][aVertex]*3+2]);
                this.indices.push(newIndex);
                this.normals.push(this.faces[i].vertexNormals[aVertex][0]);
                this.normals.push(this.faces[i].vertexNormals[aVertex][1]);
                this.normals.push(this.faces[i].vertexNormals[aVertex][2]);
                newIndex=newIndex+1;
            }

        }

        this.vertices=redundantVertices;
    }
    Geometry.prototype.verticesFromFaceUvs=function(vertices,uvs,materialIndex){
        var vertexVectors=[];
        var redundantVertexVectors=[];
        var redundantSkinIndices=[];
        var redundantSkinWeights=[];

        var vertexCovered=[];
        for(var i=0;i<vertices.length;i=i+3){
            var vectorA=vec3.fromValues(vertices[i],vertices[i+1],vertices[i+2]);

            vertexVectors.push(vectorA);
        }
        for(var i=0;i<this.skinIndices.length;i=i+4){
            var vectorA=vec4.fromValues(this.skinIndices[i],this.skinIndices[i+1],this.skinIndices[i+2],this.skinIndices[i+3]);
            var vectorB=vec4.fromValues(this.skinWeights[i],this.skinWeights[i+1],this.skinWeights[i+2],this.skinWeights[i+3]);

            redundantSkinIndices.push(vectorA);
            redundantSkinWeights.push(vectorB);
        }

        var count=0;
        for(var i=0;i<this.faceVertexUvs[materialIndex].length;++i)
        {
            var face=this.faces[i];
            var textureIndices=this.faceVertexUvs[materialIndex][i];
            var aVertexIndices=["a","b","c"];
            for(var vertexIndex=0;vertexIndex<aVertexIndices.length;++vertexIndex){
                var aVertexIndex=aVertexIndices[vertexIndex];

                if(redundantVertexVectors[textureIndices[aVertexIndex]]==face[aVertexIndex]||redundantVertexVectors[textureIndices[aVertexIndex]]===undefined){
                    redundantVertexVectors[textureIndices[aVertexIndex]]=face[aVertexIndex];
                    face[aVertexIndex]=textureIndices[aVertexIndex];
                }

                else{

                    uvs[materialIndex].push(uvs[materialIndex][textureIndices[aVertexIndex]*2]);
                    uvs[materialIndex].push(uvs[materialIndex][textureIndices[aVertexIndex]*2+1]);
                    var newIndex=Math.floor(uvs[materialIndex].length/2)-1;
                    redundantVertexVectors[newIndex]=face[aVertexIndex];
                    face[aVertexIndex]=newIndex;
                    textureIndices[aVertexIndex]=newIndex
                }
            }
        }
        var tempSkinIndices=[];
        var tempSkinWeights=[];

        for(var i=0;i<redundantVertexVectors.length;++i)
        {

            var vectorA=vertexVectors[redundantVertexVectors[i]];
            var vectorB=redundantSkinIndices[redundantVertexVectors[i]];
            var vectorC=redundantSkinWeights[redundantVertexVectors[i]];

            this.vertices.push(vectorA[0]);
            this.vertices.push(vectorA[1]);
            this.vertices.push(vectorA[2]);
            if(redundantSkinIndices.length>0){
            tempSkinIndices.push(vectorB[0]);
            tempSkinIndices.push(vectorB[1]);
            tempSkinIndices.push(vectorB[2]);
            tempSkinIndices.push(vectorB[3]);
            tempSkinWeights.push(vectorC[0]);
            tempSkinWeights.push(vectorC[1]);
            tempSkinWeights.push(vectorC[2]);
            tempSkinWeights.push(vectorC[3]);

            }



        }
        if(redundantSkinIndices.length>0){
        this.skinIndices=tempSkinIndices;
        this.skinWeights=tempSkinWeights;
        }
        this.uvs=uvs;
    }
Geometry.prototype.morphedVertexNormalsFromObj=function(){
        var vertexVectors=[];
        var normalVectors=[];

        for(var i=0;i<this.faces.length;i=i+1){
            if(!(this.faces[i].normal==undefined)&&this.faces[i].vertexNormals.length==0){
                this.faces[i].vertexNormals["a"]=vec3.clone(this.faces[i].normal);
                this.faces[i].vertexNormals["b"]=vec3.clone(this.faces[i].normal);
                this.faces[i].vertexNormals["c"]=vec3.clone(this.faces[i].normal);
            }
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

        }
        this.normals=[];
        for(var j=0;j<normalVectors.length;j=j+1){
            vec3.normalize(normalVectors[j],normalVectors[j]);
            this.normals.push(normalVectors[j][0]);
            this.normals.push(normalVectors[j][1]);
            this.normals.push(normalVectors[j][2]);

        }


    }
    Geometry.prototype.calculateVertexNormals=function(){
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
        Geometry.prototype.clone=function(){
        var geometry=new Geometry();
        var i,j;
        for(i=0;i<this.vertices.length;++i){
            geometry.vertices[i]=this.vertices[i];
        }
        for(i=0;i<this.faces.length;++i){
            geometry.faces[i]=this.faces[i].clone();
        }
        for(i=0;i<this.uvs.length;++i){
            for(j=0;j<this.uvs[i].length;++j) geometry.uvs[i][j]=this.uvs[i][j];
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



