
FreeCamera = inherit(Camera, function ()
{

  superc(this);
  // Delta Values for Animations
  this.linVel = vec3.fromValues(0.0, 0.0, 0.0); // Animation of positions
  this.angVel = vec3.fromValues(0.0, 0.0, 0.0); // Animations of rotation around (side Vector, up Vector, dir Vector)
});



FreeCamera.prototype.yaw =function (angle)
{
    this.rotateOnAxis(this.up, angle);
}

FreeCamera.prototype.pitch =function (angle)
{
  this.rotateOnAxis(this.left, angle);
}

FreeCamera.prototype.roll =function (angle)
{
  this.rotateOnAxis(this.dir, angle);
}

    FreeCamera.prototype.rotateOnAxis =function (axisVec, angle)
{
  // Create a proper Quaternion based on location and angle
  var quate=quat.create();
  quat.setAxisAngle(quate, axisVec, angle)
  
  // Create a rotation Matrix out of this quaternion
  vec3.transformQuat(this.dir, this.dir, quate)  
  vec3.transformQuat(this.left, this.left, quate)  
  vec3.transformQuat(this.up, this.up, quate)  
  vec3.normalize(this.up,this.up);
  vec3.normalize(this.left,this.left);
  vec3.normalize(this.dir,this.dir);
  
  
}

FreeCamera.prototype.setAngularVel =function (newVec)
{
  this.angVel[0] = newVec[0];
  this.angVel[1] = newVec[1];
  this.angVel[2] = newVec[2];
}

/**
 Get the camera's angular velocity

 @return {Array}
 */

FreeCamera.prototype.getAngularVel =function ()
{
    return vec3.clone(this.angVel);
}


FreeCamera.prototype.getLinearVel =function ()
{
    return vec3.clone(this.linVel);
}

FreeCamera.prototype.setLinearVel =function (newVec)
{
  this.linVel[0] = newVec[0];
  this.linVel[1] = newVec[1];
  this.linVel[2] = newVec[2];
}

FreeCamera.prototype.setLookAtPoint =function (newVec)
{
    // if the position hasn't yet been changed and they want the
    // camera to look at [0,0,0], that will create a problem.
  if (isVectorEqual(this.pos, [0, 0, 0]) && isVectorEqual(newVec, [0, 0, 0]))
  {
  
  }
  else
  {
    // Figure out the direction of the point we are looking at.
    vec3.subtract(this.dir,newVec, this.pos);
     vec3.normalize(this.dir,this.dir);
    // Adjust the Up and Left vectors accordingly
    vec3.cross(this.left,vec3.fromValues(0, 1, 0), this.dir );
    vec3.normalize(this.left,this.left);
    vec3.cross(this.up,this.dir, this.left);
    vec3.normalize(this.up,this.up);
  }
}
 


/**
 Set the new location of the camera.
 
 @param {Array} newVec An absolute value of where to 
 place the camera.
 */
    FreeCamera.prototype.setPosition =function (newVec)
{
  this.pos=vec3.fromValues(newVec[0],newVec[1],newVec[2])

}

    FreeCamera.prototype.setUpVector =function (newVec)
{
  this.up[0] = newVec[0];
  this.up[1] = newVec[1];
  this.up[2] = newVec[2];
}

FreeCamera.prototype.moveForward = function(s){

    var newPosition = [this.pos[0] - s*this.dir[0],this.pos[1] - s*this.dir[1],this.pos[2] - s*this.dir[2]];

    this.setPosition(newPosition);

}



/**
 @private
 
 Called automatically.
 
 Update Animation of the camera.
 
 @param {float} timeStep 
 */
    FreeCamera.prototype.update =function (timeStep)
{

  if (vec3.squaredLength(this.linVel)==0 && vec3.squaredLength(this.angularVel)==0) 
  return false;

  if (vec3.squaredLength(this.linVel) > 0.0)
  {
    // Add a velocity to the position
    vec3.scale(this.velVec,this.velVec, timeStep);

    vec3.add(this.pos, this.velVec, this.pos);
  }

  if (vec3.squaredLength(this.angVel) > 0.0)
  {
    // Apply some rotations to the orientation from the angular velocity
    this.pitch(this.angVel[0] * timeStep);
    this.yaw(this.angVel[1] * timeStep);
    this.roll(this.angVel[2] * timeStep);
  }

  return true;
  
}


