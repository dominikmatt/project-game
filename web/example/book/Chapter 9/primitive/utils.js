function inherit(parentObject, child)
  {
    child.prototype.__proto__ = parentObject.prototype;
    child.prototype.__parent = parentObject;
    return child;
  }
function applyProjection(vector,m){

    var x = vector[0], y = vector[1], z = vector[2];

    var e = m;
    var d = 1 / ( e[3] * x + e[7] * y + e[11] * z + e[15] ); // perspective divide

    var x1 = ( e[0] * x + e[4] * y + e[8]  * z + e[12] ) * d;
    var y1 = ( e[1] * x + e[5] * y + e[9]  * z + e[13] ) * d;
    var z1 = ( e[2] * x + e[6] * y + e[10] * z + e[14] ) * d;

    return vec3.fromValues(x1,y1,z1);
}
function degToRadian(angle){
    return (angle*22/7)/180;
}
   function superc(o)
  {
    var tmpparent = o.__parent;

    // Temporarily change our parent to be our parent's parent to
    // avoid infinite recursion.
    if (!(o.__parent===undefined) &&o.__parent.prototype.__parent){
      o.__parent = o.__parent.prototype.__parent;
    }
    tmpparent.prototype.constructor.apply(o);
    delete o.__parent;
  }
  function isVectorEqual(vecone,vectwo)
  {
   if(vecone[0]==vectwo[0]&&vecone[1]==vectwo[1]&&vecone[2]==vectwo[2])
   {
   return true;
   }
   else{
    return false;
   }
  }
Function.prototype.inheritsFrom = function( parentClassOrObject ){
    if ( parentClassOrObject.constructor == Function )
    {
        //Normal Inheritance
        this.prototype = new parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject.prototype;
    }
    else
    {
        //Pure Virtual Inheritance
        this.prototype = parentClassOrObject;
        this.prototype.constructor = this;
        this.prototype.parent = parentClassOrObject;
    }
    return this;
}