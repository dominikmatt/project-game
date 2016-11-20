Bone= inherit(StageObject, function (belongsToSkin ) {
    superc(this);
    var d = new Date();

    this.id ="id-"+d.getTime();
    this.skin = belongsToSkin;
    this.skinMatrix = mat4.create();




});
Bone.prototype.update=function ( parentSkinMatrix, forceUpdate ) {

    // update local

    if ( this.matrixAutoUpdate ) {

        forceUpdate |= this.updateMatrix();

    }

    // update skin matrix

    if ( forceUpdate || this.matrixWorldNeedsUpdate ) {

        if( parentSkinMatrix ) {

           mat4.mul(this.skinMatrix,parentSkinMatrix, this.modelMatrix);
           //console.log(parentSkinMatrix)    ;
        } else {

            mat4.copy(this.skinMatrix,this.modelMatrix );

        }

        this.matrixWorldNeedsUpdate = false;
        forceUpdate = true;

    }

    // update children

    var child, i, l = this.children.length;

    for ( i = 0; i < l; i ++ ) {

        this.children[ i ].update( this.skinMatrix, forceUpdate );

    }

}

