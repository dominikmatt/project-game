/*
 * @author oosmoxiecode
 * @author toji
 * 
 * This is based on the work of Brandon Jones(@toji).
 * See this blog post and his demo: http://blog.tojicode.com/2010/06/its-alive-idtech4-models-with-skinning.html
 * I have 'borrowed' his regexp to save me some headache. ;)
 * Included his copyright notice below.
 * 
 */

/*
 * Copyright (c) 2011 Brandon Jones
 *
 * This software is provided 'as-is', without any express or implied
 * warranty. In no event will the authors be held liable for any damages
 * arising from the use of this software.
 *
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 *
 *    1. The origin of this software must not be misrepresented; you must not
 *    claim that you wrote the original software. If you use this software
 *    in a product, an acknowledgment in the product documentation would be
 *    appreciated but is not required.
 *
 *    2. Altered source versions must be plainly marked as such, and must not
 *    be misrepresented as being the original software.
 *
 *    3. This notice may not be removed or altered from any source
 *    distribution.
 */
var script = document.createElement('script');
script.src = "js/three.min.js";
document.getElementsByTagName('script')[0].parentNode.appendChild(script);

var MD5_converter = (function() {

	var converter = {};

	var meshData = { joints: [], meshes: [] };

	var fileName;
	var animName

	// "globals"
	var globalAnim;

	var globalSkinIndices;
	var globalSkinWeights;

	// number of decimals
	var globalPrecision = 3; // for vertices and uvs
	var globalPrecision2 = 6; // for bones position and rotation

	converter.lockRootBone = false;
	converter.animationOnly = false;

	// return this
	var returnObject = {string: "", stringAnimationOnly: "", stringLocked: "", stringAnimationOnlyLocked: "", info: {}};


	// loaders
	/*converter.load = function ( md5mesh, md5anim ) {

		converter.load_md5anim( md5anim );

		converter.load_md5mesh( md5mesh );

		return returnObject;

	}

	converter.load_md5mesh = function ( url ) {
		var request = new XMLHttpRequest();
		request.open('GET', url, false);
		
		request.send();
		
		if (request.readyState != 4) {
			return '';
		}
		
		parse_md5mesh( request.responseText );
		bindPose();
		loopTrace();

	}

    converter.load_md5anim = function ( url )  {
		var request = new XMLHttpRequest();
		request.open('GET', url, false);
		
		request.send();
		
		if (request.readyState != 4) {
			return '';
		}
		
		parse_md5anim(request.responseText);
    }*/

	converter.process_md5mesh = function ( src, name ) {
		fileName = name;
		parse_md5mesh( src );

		// check if globalAnim exists
		if (globalAnim) {
			bindPose();
			constructStrings();

			return returnObject;
		} else {
			return null;
		}

	}

    converter.process_md5anim = function ( src, name )  {
    	animName = name;
		parse_md5anim(src);

		// check if any meshes exists
		if (meshData.meshes.length > 0) {
			bindPose();
			constructStrings();

			return returnObject;
		} else {
			return null;
		}

    }

	var parse_md5mesh = function ( src ) {
        
        src.replace(/joints \{([^}]*)\}/m, function($0, jointSrc) {
            jointSrc.replace(/\"(.+)\"\s(.+) \( (.+) (.+) (.+) \) \( (.+) (.+) (.+) \)/g, function($0, name, parent, x, y, z, ox, oy, oz) {

            	var pox = parseFloat(ox);
            	var poy = parseFloat(oy);
            	var poz = parseFloat(oz);
            	var pow = -Math.sqrt(Math.abs(1.0 - pox * pox - poy * poy - poz * poz));

                meshData.joints.push({
                    name: name,
                    parent: parseInt(parent), 
                    pos: new THREE.Vector3(parseFloat(x), parseFloat(y), parseFloat(z)),
                   	orient: new THREE.Quaternion(pox, poy, poz, pow)
                     
                });
            });
        });

        src.replace(/mesh \{([^}]*)\}/mg, function($0, meshSrc) {
            var mesh = {
                shader: '',
                verts: new Array(),
                tris: new Array(),
                weights: new Array(),
                vertBuffer: null,
                indexBuffer: null,
                vertArray: null,
                elementCount: 0
            };

            meshSrc.replace(/shader \"(.+)\"/, function($0, shader) {
                mesh.shader = shader;
            });

            meshSrc.replace(/vert .+ \( (.+) (.+) \) (.+) (.+)/g, function($0, u, v, weightIndex, weightCount) {
                mesh.verts.push({
                    pos: new THREE.Vector3(0, 0, 0),
                    normal: new THREE.Vector3(0, 0, 0),
                    tangent: new THREE.Vector3(0, 0, 0),
                    texCoord: new THREE.Vector2(parseFloat(u), parseFloat(v)),
                    weight: {
                        index: parseInt(weightIndex), 
                        count: parseInt(weightCount)
                    }
                });
            });

            mesh.tris = new Array();
            meshSrc.replace(/tri .+ (.+) (.+) (.+)/g, function($0, i1, i2, i3) {
                mesh.tris.push(parseInt(i1));
                mesh.tris.push(parseInt(i2));
                mesh.tris.push(parseInt(i3));
            });
            mesh.elementCount = mesh.tris.length;

            meshSrc.replace(/weight .+ (.+) (.+) \( (.+) (.+) (.+) \)/g, function($0, joint, bias, x, y, z) {
                mesh.weights.push({
                    joint: parseInt(joint), 
                    bias: parseFloat(bias), 
                    pos: new THREE.Vector3(parseFloat(x), parseFloat(y), parseFloat(z)),
                    normal: new THREE.Vector3(0, 0, 0),
                    tangent: new THREE.Vector3(0, 0, 0)
                });
            });

            meshData.meshes.push(mesh);
        });

    }

    var bindPose = function () {
    	
        var joints = meshData.joints;

   		var rotatedPos = new THREE.Vector3(0, 0, 0);

        globalSkinWeights = [];
        globalSkinIndices = [];

        var frame0 = getFrame(0, true);

        for (var m = 0; m < meshData.meshes.length; m++) {

        	var mesh = meshData.meshes[m];

        	var lastbias = 0;

	        // Calculate transformed vertices in the bind pose
	        for(var i = 0; i < mesh.verts.length; ++i) {
	            var vert = mesh.verts[i];

	            vert.pos = new THREE.Vector3(0, 0, 0);
	            for (var j = 0; j < vert.weight.count; ++j) {
	                var weight = mesh.weights[vert.weight.index + j];
					var joint = frame0[weight.joint];

	                // max 2 influences
	                if (j == 0) {
	                	var heavyBones = getTwoHeaviestWeights(vert, mesh);
	                	globalSkinWeights.push(heavyBones[0].bias.toFixed(globalPrecision));
	               		globalSkinWeights.push(heavyBones[1].bias.toFixed(globalPrecision));
	                	
	                	globalSkinIndices.push(heavyBones[0].joint);
	                	globalSkinIndices.push(heavyBones[1].joint);			                	
	                }


	                joint.orient.multiplyVector3(weight.pos, rotatedPos);

	                // Translate position
	                // The sum of all weight biases should be 1.0
	                vert.pos.x += (joint.pos.x + rotatedPos.x) * weight.bias;
	                vert.pos.z += (joint.pos.y + rotatedPos.y) * weight.bias;
	                vert.pos.y += (joint.pos.z + rotatedPos.z) * weight.bias;

	            }

	        }

        }

    }


    var constructStrings = function () {

    	//console.log(model);
    	//console.log(globalAnim);

    	var vertices = [];
    	var faces = [];
    	var uvs = [];
    	var materials = [];

    	var vertCount = 0;
    	var faceCount = 0;

        for (var m = 0; m < meshData.meshes.length; m++) {
        	var mesh = meshData.meshes[m];

	    	for (var i = 0; i < mesh.verts.length; i++) {
	    		var o = mesh.verts[i];

	    		var pos = o.pos;
	    		vertices.push(pos.x.toFixed(globalPrecision));
	    		vertices.push(pos.z.toFixed(globalPrecision));
	    		vertices.push(pos.y.toFixed(globalPrecision));

	    		uvs.push(o.texCoord.x.toFixed(globalPrecision));
	    		uvs.push((1-o.texCoord.y).toFixed(globalPrecision));

	    	}


	    	for (var i = 0; i < mesh.tris.length; i+=3) {

	    		faces.push(10);
	    		faces.push(mesh.tris[i]+vertCount);
	    		faces.push(mesh.tris[i+2]+vertCount);
	    		faces.push(mesh.tris[i+1]+vertCount);

	    		// material index
	    		faces.push(m);

				// uvs
				faces.push(mesh.tris[i]+vertCount);
	    		faces.push(mesh.tris[i+2]+vertCount);
	    		faces.push(mesh.tris[i+1]+vertCount);
	    	}

	    	vertCount += mesh.verts.length;
	    	faceCount += mesh.tris.length/3;

	    	var lastIndex = mesh.shader.lastIndexOf("/");
	    	var materialName = escape( mesh.shader.substr(lastIndex+1, mesh.shader.length) );
	    	var m_str = "\n{\n\"DbgColor\" : 15658734,\n\"DbgIndex\" : "+m+",\n\"DbgName\" : \""+materialName+"\"\n}";
	    	materials[m] = m_str;

	    }

    	var animLength = ((globalAnim.frames.length-1) * globalAnim.frameTime) /1000;
    	var animFps = globalAnim.frameRate;

    	var lastpos = 0;

    	// animation
		var hierarchyStr = "[";
		var hierarchyStrLocked = "[";
		
		for (var i = 0; i < globalAnim.hierarchy.length; i++) {

			var bone = globalAnim.hierarchy[i];
			var parent = bone.parent;

			var boneStr = "{ \"parent\":" + parent+", \"keys\": [";
			var boneStrLocked = "{ \"parent\":" + parent+", \"keys\": [";

			for (var j = 0; j < globalAnim.frames.length; j++) {
				var f = getFrame(j);
				var pos = f[i].pos;
				var rot = f[i].orient;
				var time = (globalAnim.frameTime * j) / 1000;

				var posLocked = pos.clone();
				var rotLocked = rot.clone();

				// zero the root bone
				/*if (i == 0 && converter.lockRootBone) {
					pos = new THREE.Vector3(0,0,0);
					rot = new THREE.Quaternion(0,0,0,0);	
				}*/
				if (i == 0) {
					posLocked = new THREE.Vector3(0,0,0);
					rotLocked = new THREE.Quaternion(0,0,0,0);	
				}

				boneStr += "{ \"time\":"+time+", \"pos\": ["+pos.x.toFixed(globalPrecision2)+","+pos.y.toFixed(globalPrecision2)+","+pos.z.toFixed(globalPrecision2)+"], \"rot\": ["+rot.x.toFixed(globalPrecision2)+","+rot.y.toFixed(globalPrecision2)+","+rot.z.toFixed(globalPrecision2)+","+rot.w.toFixed(globalPrecision2)+"]";
				boneStrLocked += "{ \"time\":"+time+", \"pos\": ["+posLocked.x.toFixed(globalPrecision2)+","+posLocked.y.toFixed(globalPrecision2)+","+posLocked.z.toFixed(globalPrecision2)+"], \"rot\": ["+rotLocked.x.toFixed(globalPrecision2)+","+rotLocked.y.toFixed(globalPrecision2)+","+rotLocked.z.toFixed(globalPrecision2)+","+rotLocked.w.toFixed(globalPrecision2)+"]";

				// add scale first and last only
				if (j == 0 || j == globalAnim.frames.length-1) {
					boneStr += ", \"scl\": [1,1,1]";
					boneStrLocked += ", \"scl\": [1,1,1]";
				}

				// end
				boneStr += " }";
				boneStrLocked += " }";

				// comma
				if (j < globalAnim.frames.length-1) {
					boneStr += ", ";
					boneStrLocked += ", ";
				}

			}

			hierarchyStr += boneStr;
			hierarchyStr += "] }";
			hierarchyStrLocked += boneStrLocked;
			hierarchyStrLocked += "] }";

			if (i < globalAnim.hierarchy.length-1) {
				hierarchyStr += ", ";
				hierarchyStrLocked += ", ";
			}
			

		}

		hierarchyStr += "]";
		hierarchyStrLocked += "]";


		// bones String - from the model
		var frame0 = getFrame(0);

		var bonesStr = "[";
		for (var i = 0; i < globalAnim.baseFrame.length; i++) {
			if (i>0) bonesStr += ",";
			var name = globalAnim.hierarchy[i].name;
			var parent = globalAnim.hierarchy[i].parent;
			var pos = frame0[i].pos;
			var orient = frame0[i].orient;

			bonesStr += "{\"parent\":"+parent+",\"name\":\""+name+"\",\"pos\":["+pos.x.toFixed(globalPrecision2)+","+pos.y.toFixed(globalPrecision2)+","+pos.z.toFixed(globalPrecision2)+"],\"rotq\":["+orient.x.toFixed(globalPrecision2)+","+orient.y.toFixed(globalPrecision2)+","+orient.z.toFixed(globalPrecision2)+","+orient.w.toFixed(globalPrecision2)+"]}"

		};
		bonesStr += "]";
				


		var skinWeightsStr = "["+globalSkinWeights.toString()+"]";
		var skinIndicesStr = "["+globalSkinIndices.toString()+"]";

		if (converter.animationOnly) {
			vertices = [];
			uvs = [];
			faces = [];
			bonesStr = "";
			skinIndicesStr = "";
			skinWeightsStr = "";
		}


		var composeString = function () {
			var str = "";
			// metadata
			str += "{\n\n\"metadata\" : {\n\"formatVersion\" : 3.1,\n\"description\"	: \"Md 5 model converted from "+fileName+".md5mesh using MD5 to json converter.\"\n},";

			if (!converter.animationOnly) {
				// scale +material
				str += "\n\n\"scale\" : 1.000000,\n\n\"materials\": ["+materials.toString()+"],";
				// vertices
				str += "\n\n\"vertices\": ["+vertices.toString()+"],";
				// uvs
				str += "\n\n\"uvs\": [["+uvs.toString()+"]],";
				// faces
				str += "\n\n\"faces\": ["+faces.toString()+"],";
			} else {
				// scale +material
				str += "\n\n\"scale\" : 1.000000,\n\n\"materials\": [],";
				// vertices
				str += "\n\n\"vertices\": [],";
				// uvs
				str += "\n\n\"uvs\": [[]],";
				// faces
				str += "\n\n\"faces\": [],";
			}
			
			if (!converter.animationOnly) {
				// bones
				str += "\n\n\"bones\": "+bonesStr+",";

				// skinIndices
				str += "\n\n\"skinIndices\": "+skinIndicesStr+",";

				// skinWeights
				str += "\n\n\"skinWeights\": "+skinWeightsStr+",";
			}

			// animation
			if (converter.lockRootBone) {
				str += "\n\n\"animation\": {\"name\": \""+animName+"\", \"length\": "+animLength+", \"fps\": "+animFps+", \"hierarchy\":"+hierarchyStrLocked+"}";
			} else {
				str += "\n\n\"animation\": {\"name\": \""+animName+"\", \"length\": "+animLength+", \"fps\": "+animFps+", \"hierarchy\":"+hierarchyStr+"}";
			}

			// end
			str += "\n\n}";	

			return str;		
		}


		//Returns a object like: {string: json_string, info: {status: "Success", faces: 10, vertices: 10, frames: 5 }}
		returnObject.info.status = "Success";
		returnObject.info.faces = faceCount;
		returnObject.info.vertices = vertCount;
		returnObject.info.frames = globalAnim.frames.length;
		returnObject.info.joints = meshData.joints.length;

		returnObject.string = composeString();

		var lastAnimationState = converter.animationOnly;
		converter.animationOnly = true;
		returnObject.stringAnimationOnly = composeString();
		converter.animationOnly = lastAnimationState;

		var lastLockState = converter.lockRootBone;
		converter.lockRootBone = true;
		returnObject.stringLocked = composeString();
		converter.lockRootBone = lastLockState;

		lastAnimationState = converter.animationOnly;
		lastLockState = converter.lockRootBone;
		converter.animationOnly = true;
		converter.lockRootBone = true;
		returnObject.stringAnimationOnlyLocked = composeString();
		converter.animationOnly = lastAnimationState;
		converter.lockRootBone = lastLockState;

    }


    var parse_md5anim = function ( src ) {

        var anim = {frameRate: 24, frameTime: 1000/24, hierarchy: [], baseFrame: [], frames: []};
        
        src.replace(/frameRate (.+)/, function($0, frameRate) {
            anim.frameRate = parseInt(frameRate);
            anim.frameTime = 1000 / frameRate;
        });

        src.replace(/hierarchy \{([^}]*)\}/m, function($0, hierarchySrc) {
            hierarchySrc.replace(/\"(.+)\"\s([-\d]+) (\d+) (\d+)\s/g, function($0, name, parent, flags, index) {
                anim.hierarchy.push({
                    name: name,
                    parent: parseInt(parent), 
                    flags: parseInt(flags), 
                    index: parseInt(index)
                });
            });
        });

        src.replace(/baseframe \{([^}]*)\}/m, function($0, baseframeSrc) {
            baseframeSrc.replace(/\( (.+) (.+) (.+) \) \( (.+) (.+) (.+) \)/g, function($0, x, y, z, ox, oy, oz) {

                anim.baseFrame.push({
                    pos: new THREE.Vector3(parseFloat(x), parseFloat(y), parseFloat(z)), 
                    orient: new THREE.Quaternion(parseFloat(ox), parseFloat(oy), parseFloat(oz), 0)
                });
            });
        });


        src.replace(/frame \d+ \{([^}]*)\}/mg, function($0, frameSrc) {
            var frame = new Array();

            frameSrc.replace(/([-\.\d]+)/g, function($0, value) {
                frame.push(parseFloat(value));
            });

            anim.frames.push(frame);
        });

        globalAnim = anim;

    }

    var getFrame = function ( frame, pose ) {

        //frame = frame % this.frames.length;
    
        var frameData = globalAnim.frames[frame]; 
        var joints = [];

        for (var i = 0; i < globalAnim.baseFrame.length; ++i) {
            var baseJoint = globalAnim.baseFrame[i];
            var offset = globalAnim.hierarchy[i].index;
            var flags = globalAnim.hierarchy[i].flags;

            //console.log(i, baseJoint, offset, flags);

            var aPos = new THREE.Vector3(baseJoint.pos.x, baseJoint.pos.y, baseJoint.pos.z);
            var aOrient = new THREE.Quaternion(baseJoint.orient.x, baseJoint.orient.y, baseJoint.orient.z, 0);

            var j = 0;

            if (flags & 1) { // Translate X
                aPos.x = frameData[offset + j];
                ++j;
            }

            if (flags & 2) { // Translate Y
                aPos.y = frameData[offset + j];
                ++j;
            }

            if (flags & 4) { // Translate Z
                aPos.z = frameData[offset + j];
                ++j;
            }

            if (flags & 8) { // Orient X
                aOrient.x = frameData[offset + j];
                ++j;
            }

            if (flags & 16) { // Orient Y
                aOrient.y = frameData[offset + j];
                ++j;
            }

            if (flags & 32) { // Orient Z
                aOrient.z = frameData[offset + j];
                ++j;
            }

            // Recompute W value
         	aOrient.w = -Math.sqrt(Math.abs(1.0 - aOrient.x * aOrient.x - aOrient.y * aOrient.y - aOrient.z * aOrient.z));

            // Multiply against parent 
            //(assumes parents always have a lower index than their children)
            var parentIndex = globalAnim.hierarchy[i].parent;

            if(parentIndex >= 0 && pose) {
                var parentJoint = joints[parentIndex];
               	parentJoint.orient.multiplyVector3(aPos);
                aPos.add(parentJoint.pos);
				aOrient.multiply(parentJoint.orient, aOrient);
            }

            joints.push({pos: aPos, orient: aOrient});
        }

        return joints;

    }


    // Helper

    var getTwoHeaviestWeights = function ( vertex, mesh ) {

    	var array = [{bias: 0, joint:0},{bias: 0, joint:0}];

    	// first influence
    	var highestWeight = 0;
    	var highestJoint = 0;

    	for (var j = 0; j < vertex.weight.count; ++j) {
    		var weight = mesh.weights[vertex.weight.index + j];
    		var bias = weight.bias;

    		if (bias > highestWeight) {
    			highestWeight = bias;
    			highestJoint = weight.joint;
    		}
    	}

    	array[0].bias = highestWeight;
    	array[0].joint = highestJoint;

    	// second influence?
    	if (vertex.weight.count > 1) {
	    	var secondHighestWeight = 0;
	    	var secondHighestJoint = 0;

	    	for (var j = 0; j < vertex.weight.count; ++j) {
	    		var weight = mesh.weights[vertex.weight.index + j];
	    		var bias = weight.bias;

	    		if (bias > secondHighestWeight && weight.joint != highestJoint) {
	    			secondHighestWeight = bias;
	    			secondHighestJoint = weight.joint;
	    		}
	    	}

	    	array[1].bias = secondHighestWeight;
	    	array[1].joint = secondHighestJoint;
    	}

    	// "normalize" the weights to always have a sum of 1
    	if (vertex.weight.count > 2) {
    		var sum = array[0].bias + array[1].bias;
    		array[0].bias = array[0].bias/sum;
    		array[1].bias = array[1].bias/sum;
    	}

    	return array;
    }



	return converter;

})();