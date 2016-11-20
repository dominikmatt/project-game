function calculateVertexNormals(vertices,indices){
    var vertexVectors=[];
    var normalVectors=[];
    var normals=[];
    var j;
    for(var i=0;i<vertices.length;i=i+3){
        var vector=vec3.fromValues(vertices[i],vertices[i+1],vertices[i+2]);
        var normal=vec3.create();//Intiliazed normal array
        normalVectors.push(normal);
        vertexVectors.push(vector);
    }
    try{
        for(j=0;j<indices.length;j=j+3)//Since we are using triads of indices to represent one primitive
        {

            //v1-v0
            var vector1=vec3.create();
            vec3.subtract(vector1,vertexVectors[indices[j+1]],vertexVectors[indices[j]]);
            //v2-v1
            var vector2=vec3.create();
            vec3.subtract(vector2,vertexVectors[indices[j+2]],vertexVectors[indices[j+1]]);
            var normal=vec3.create();
            //cross product of two vector
            vec3.cross(normal, vector1, vector2);
            //Since the normal caculated from three vertices is same for all the three vertices(same face/surface), the contribution from each normal to the corresponding vertex  is the same
            vec3.add(normalVectors[indices[j]],normalVectors[indices[j]],normal);
            vec3.add(normalVectors[indices[j+1]],normalVectors[indices[j+1]],normal);
            vec3.add(normalVectors[indices[j+2]],normalVectors[indices[j+2]],normal);

        }
    }catch(e){
        alert(j);
    }
    for(var j=0;j<normalVectors.length;j=j+1){
        vec3.normalize(normalVectors[j],normalVectors[j]);
        normals.push(normalVectors[j][0]);
        normals.push(normalVectors[j][1]);
        normals.push(normalVectors[j][2]);

    }
    return normals;
}
