function inherit(parentObject, child)
  {
    child.prototype.__proto__ = parentObject.prototype;
    child.prototype.__parent = parentObject;
    return child;
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