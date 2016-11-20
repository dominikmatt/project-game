TerrainData = function (width,height,segmentsW,segmentsH,geometry) {
    var textureX= width / 2;
    var textureY = height / 2;

    //Min of coordinate horizontally;
     this._minW=-textureX;

    //Min of coordinate vertically;
     this._minH= -textureY;

    //Max of coordinate horizontally;
     this._maxW=textureX;

    //Max of coordinate vertically;
     this._maxH=textureY;

    //The horizontal length of each segment;
     this._dw=width / segmentsW;

    //The vertical length of each segment;
     this._dh=height / segmentsH;;

    //the heights of all vertices
     this._heights=[[]];

     this._segmentsW=segmentsW;

     this._segmentsH=segmentsH;
     this.geomtery=geometry;
     this._maxHeight=10;
    for ( var ix = 0; ix <= this._segmentsW; ix++ )
    {
        this._heights[ix] = [];
        for ( var iy = 0; iy <= this._segmentsH; iy++ )
        {   this._heights[ix][iy] = this.geomtery.getHeights(ix,iy);
        }
    }
}
TerrainData.prototype.get_minW=function() {
    return this._minW;
}
TerrainData.prototype.get_minH=function() {
    return this._minH;
}
TerrainData.prototype.get_maxW=function() {
    return this._maxW;
}
TerrainData.prototype.get_maxH=function() {
    return this._maxH;
}
TerrainData.prototype.get_dw=function() {
    return this._dw;
}
TerrainData.prototype.get_dh=function() {
    return this._dh;
}
TerrainData.prototype.get_sw=function() {
    return this._segmentsW;
}
TerrainData.prototype.get_sh=function() {
    return this._segmentsH;
}
TerrainData.prototype.get_heights=function(i1,j1) {
    return this._heights[i1][j1];
}
TerrainData.prototype.get_maxHeight=function(){
    return this._maxHeight;
}
