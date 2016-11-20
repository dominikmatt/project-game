
Animation = function ( root, name) {

	this.root = root;
	this.data = AnimationHandler.get( name );
	this.hierarchy = AnimationHandler.parse( root );

	this.currentTime = 0;
	this.timeScale = 1;

	this.isPlaying = false;
	this.isPaused = true;
	this.loop = true;



	this.points = [];
	this.target = vec3.create();

};

Animation.prototype.play = function ( loop, startTimeMS ) {

	if ( this.isPlaying === false ) {

		this.isPlaying = true;
		this.loop = loop !== undefined ? loop : true;
		this.currentTime = startTimeMS !== undefined ? startTimeMS : 0;

		// reset key cache

		var h, hl = this.hierarchy.length,object;

		for ( h = 0; h < hl; h ++ ) {

			object = this.hierarchy[ h ];

			object.matrixAutoUpdate = true;

			if ( object.animationCache === undefined ) {

				object.animationCache = {};
				object.animationCache.prevKey = { pos: 0, rot: 0, scl: 0 };
				object.animationCache.nextKey = { pos: 0, rot: 0, scl: 0 };
				object.animationCache.originalMatrix = object instanceof Bone ? object.skinMatrix : object.matrix;

			}

			var prevKey = object.animationCache.prevKey;
			var nextKey = object.animationCache.nextKey;

			prevKey.pos = this.data.hierarchy[ h ].keys[ 0 ];
			prevKey.rot = this.data.hierarchy[ h ].keys[ 0 ];
			prevKey.scl = this.data.hierarchy[ h ].keys[ 0 ];

			nextKey.pos = this.getNextKeyWith( "pos", h, 1 );
			nextKey.rot = this.getNextKeyWith( "rot", h, 1 );
			nextKey.scl = this.getNextKeyWith( "scl", h, 1 );

		}

		this.update( 0 );

	}

	this.isPaused = false;

	AnimationHandler.addToUpdate( this );

};


Animation.prototype.pause = function() {

	if ( this.isPaused === true ) {

		AnimationHandler.addToUpdate( this );

	} else {

		AnimationHandler.removeFromUpdate( this );

	}

	this.isPaused = !this.isPaused;

};


Animation.prototype.stop = function() {

	this.isPlaying = false;
	this.isPaused  = false;
	AnimationHandler.removeFromUpdate( this );

};


Animation.prototype.update = function ( deltaTimeMS ) {

	// early out

	if ( this.isPlaying === false ) return;


	// vars

	var types = [ "pos", "rot", "scl" ];
	var type;
	var scale;
	var vector;
	var prevXYZ, nextXYZ;
	var prevKey, nextKey;
	var object;
	var animationCache;
	var frame;

	var currentTime, unloopedCurrentTime;
	var currentPoint, forwardPoint, angle;


	this.currentTime += deltaTimeMS * this.timeScale;

	unloopedCurrentTime = this.currentTime;
	currentTime = this.currentTime = this.currentTime % this.data.length;
	frame = parseInt( Math.min( currentTime * this.data.fps, this.data.length * this.data.fps ), 10 );

	for ( var h = 0, hl = this.hierarchy.length; h < hl; h ++ ) {

		object = this.hierarchy[ h ];
		animationCache = object.animationCache;
        //console.log(object);
		// loop through pos/rot/scl

		for ( var t = 0; t < 3; t ++ ) {

			// get keys

			type    = types[ t ];
			prevKey = animationCache.prevKey[ type ];
			nextKey = animationCache.nextKey[ type ];

			// switch keys?

			if ( nextKey.time <= unloopedCurrentTime ) {

				// did we loop?

				if ( currentTime < unloopedCurrentTime ) {

					if ( this.loop ) {

						prevKey = this.data.hierarchy[ h ].keys[ 0 ];
						nextKey = this.getNextKeyWith( type, h, 1 );

						while( nextKey.time < currentTime ) {

							prevKey = nextKey;
							nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );

						}

					} else {

						this.stop();
						return;

					}

				} else {

					do {

						prevKey = nextKey;
						nextKey = this.getNextKeyWith( type, h, nextKey.index + 1 );

					} while( nextKey.time < currentTime )

				}

				animationCache.prevKey[ type ] = prevKey;
				animationCache.nextKey[ type ] = nextKey;

			}


			object.matrixAutoUpdate = true;
			object.matrixWorldNeedsUpdate = true;

			scale = ( currentTime - prevKey.time ) / ( nextKey.time - prevKey.time );
			prevXYZ = prevKey[ type ];
			nextXYZ = nextKey[ type ];


			// check scale error

			if ( scale < 0 || scale > 1 ) {

				console.log( "Animation.update: Warning! Scale out of bounds:" + scale + " on bone " + h );
				scale = scale < 0 ? 0 : 1;

			}

			// interpolate

			if ( type === "pos" ) {

				vector = object.position;



					vector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
					vector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
					vector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;


			} else if ( type === "rot" ) {

			   quat.slerp(object.quaternion, prevXYZ, nextXYZ,  scale );

			} else if ( type === "scl" ) {

				vector = object.scale;

				vector.x = prevXYZ[ 0 ] + ( nextXYZ[ 0 ] - prevXYZ[ 0 ] ) * scale;
				vector.y = prevXYZ[ 1 ] + ( nextXYZ[ 1 ] - prevXYZ[ 1 ] ) * scale;
				vector.z = prevXYZ[ 2 ] + ( nextXYZ[ 2 ] - prevXYZ[ 2 ] ) * scale;

			}

		}

	}

};


Animation.prototype.interpolate = function ( p0, p1, p2, p3, t, t2, t3 ) {

	var v0 = ( p2 - p0 ) * 0.5,
		v1 = ( p3 - p1 ) * 0.5;

	return ( 2 * ( p1 - p2 ) + v0 + v1 ) * t3 + ( - 3 * ( p1 - p2 ) - 2 * v0 - v1 ) * t2 + v0 * t + p1;

};



// Get next key with

Animation.prototype.getNextKeyWith = function ( type, h, key ) {

	var keys = this.data.hierarchy[ h ].keys;


		key = key % keys.length;


	for ( ; key < keys.length; key++ ) {

		if ( keys[ key ][ type ] !== undefined ) {

			return keys[ key ];

		}

	}

	return this.data.hierarchy[ h ].keys[ 0 ];

};

// Get previous key with

Animation.prototype.getPrevKeyWith = function ( type, h, key ) {

	var keys = this.data.hierarchy[ h ].keys;


		key = key >= 0 ? key : key + keys.length;

	for ( ; key >= 0; key -- ) {

		if ( keys[ key ][ type ] !== undefined ) {

			return keys[ key ];

		}

	}

	return this.data.hierarchy[ h ].keys[ keys.length - 1 ];

};
