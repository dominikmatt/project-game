
AnimationHandler = (function() {

	var playing = [];
	var library = {};
	var that    = {};


	//--- update ---

	that.update = function( deltaTimeMS ) {


		for( var i = 0; i < playing.length; i ++ )
			playing[ i ].update( deltaTimeMS );

	};


	//--- add ---

	that.addToUpdate = function( animation ) {

		if ( playing.indexOf( animation ) === -1 )
			playing.push( animation );

	};


	//--- remove ---

	that.removeFromUpdate = function( animation ) {

		var index = playing.indexOf( animation );

		if( index !== -1 )
			playing.splice( index, 1 );

	};


	//--- add ---

	that.add = function( data ) {


		library[ data.name ] = data;
		initData( data );

	};


	//--- get ---

	that.get = function( name ) {

		if ( typeof name === "string" ) {

			if ( library[ name ] ) {

				return library[ name ];

			} else {

				return null;

			}

		} else {

		}

	};

	//--- parse ---

	that.parse = function( root ) {

		// setup hierarchy

		var hierarchy = [];

		if ( root instanceof RiggedMesh ) {

			for( var b = 0; b < root.bones.length; b++ ) {

				hierarchy.push( root.bones[ b ] );

			}

		}

		return hierarchy;

	};



	//--- init data ---

	var initData = function( data ) {

		if( data.initialized === true )
			return;


		// loop through all keys

		for( var h = 0; h < data.hierarchy.length; h ++ ) {

			for( var k = 0; k < data.hierarchy[ h ].keys.length; k ++ ) {

				// remove minus times

				if( data.hierarchy[ h ].keys[ k ].time < 0 )
					data.hierarchy[ h ].keys[ k ].time = 0;
				// create quaternions
					var quater = data.hierarchy[ h ].keys[ k ].rot;
                    if (typeof quater === "undefined") {
                        quater=new Array(0,0,0,1);
                                            }
                    var scl=data.hierarchy[ h ].keys[ k ].scl;
                    if(typeof scl === "undefined") {
                    data.hierarchy[ h ].keys[ k ].scl=new Array(1,1,1);                     }                        
					data.hierarchy[ h ].keys[ k ].rot = quat.fromValues( quater[0], quater[1], quater[2], quater[3] );

			}

			// remove all keys that are on the same time

			for ( var k = 1; k < data.hierarchy[ h ].keys.length; k ++ ) {

				if ( data.hierarchy[ h ].keys[ k ].time === data.hierarchy[ h ].keys[ k - 1 ].time ) {

					data.hierarchy[ h ].keys.splice( k, 1 );
					k --;

				}

			}


			// set index

			for ( var k = 0; k < data.hierarchy[ h ].keys.length; k ++ ) {

				data.hierarchy[ h ].keys[ k ].index = k;

			}

		}

		// done

		data.initialized = true;

	};




	return that;

}());
