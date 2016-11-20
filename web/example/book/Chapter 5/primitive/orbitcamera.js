OrbitCamera = inherit(Camera, function ()
{
  superc(this);

  // this value cannot be set to less than 0.
  this.closestDistance = 0;

  // typically larger than the closest distance, but set to 
  // 0 here since the user will likely overwrite it anyway.
  // this value will always be greater or equal to the closest
  // distance.
  this.farthestDistance = 0;

  // the point in space the camera will 'orbit'.
  this.orbitPoint = vec3.fromValues(0, 0, 0);
});

OrbitCamera.prototype.getClosestDistance = function ()
{
  return this.closestDistance;
}

/**
 Get the distance from the camera to the orbit point.
 
 @returns {float} distance from the camera to the orbit point.
 */
OrbitCamera.prototype.getDistance = function ()
{
  return vec3.distance(this.pos, this.orbitPoint);
}


/**
 Get the farthest ditance the camera can reside from the orbit point.
 
 @returns {float} The farthest distance the camera can reside from the orbit point.
 */
OrbitCamera.prototype.getFarthestDistance = function ()
{
  return this.farthestDistance;
}


/**
 Get the point the camera is orbiting.
 
 @returns {Array} The point which the camera is orbiting.
 */
OrbitCamera.prototype.getOrbitPoint = function ()
{
  return vec3.clone(this.orbitPoint);
}


/**
 Move the camera 'distance' towards the orbit point relative to where
 the camera is positioned. The camera will not move if attempted to move
 closer than the closest allowed distance.
 
 @param {float} distance Must be greater than 0.
 */
OrbitCamera.prototype.goCloser = function (distance)
{
  // A negative value for goCloser() could be allowed and would
  // mean moving farther using a positive value, but this could
  // create some confusion and is therefore not permitted.
  if (distance > 0)
  {
    // scale it
    var shiftAmt =vec3.create(); 
    vec3.scale(shiftAmt,this.dir, distance);
    var renameMe =vec3.create();
     vec3.subtract(renameMe,this.pos, this.orbitPoint);

    var maxMoveCloser = vec3.length(renameMe) - this.getClosestDistance();

    if (vec3.length(shiftAmt) <= maxMoveCloser)
    {
       vec3.add(this.pos,this.pos, shiftAmt);
      return true;
    }
  }
  return false;
}


/**
 Move the camera 'distance' away from the orbit point relative to where
 the camera is positioned. The camera will not move if attempted to move
 farther than the farthest distance.
 
 @param {float} distance Must be greater than 0.
 */
OrbitCamera.prototype.goFarther = function (distance)
{
  // A negative value for goFarther() could be allowed and would
  // mean moving closer using a positive value, but this could
  // create some confusion and is therefore not permitted.
  if (distance > 0)
  {
    //
    var shiftAmt = vec3.create();
    var negativeDist=vec3.create();
    vec3.scale(negativeDist,this.dir, -1);
    vec3.scale(shiftAmt,negativeDist, distance);
    var newpos =vec3.create();
    vec3.add(newpos,this.pos, shiftAmt);
    
    var distanceBetweenCamAndOP = vec3.distance(newpos, this.orbitPoint);
    if (distanceBetweenCamAndOP <= this.getFarthestDistance())
    {
      this.pos = newpos;
      return true;
    }
  }
  return false;
}


/**
 Pitch the camera about the orbit point.
 
 @param {float} angle in radians.
 */
    OrbitCamera.prototype.pitch = function (angle)
{
  if (isVectorEqual(this.pos, this.orbitPoint))
  {
    // Create a proper Quaternion based on location and angle.
    // we will rotate about the global up axis.
    var quate=quat.create();
    quat.setAxisAngle(quate,  this.left, angle);
    vec3.transformQuat(this.dir, this.dir, quate);
    vec3.normalize(this.dir,this.dir);

    // update up vector
    vec3.cross(this.up,this.dir, this.left);
    vec3.normalize(this.up,this.up);

    // left does not change.
  }
  else
  {
    // get position relative to orbit point
    vec3.subtract(this.pos,this.pos, this.orbitPoint);

    // Create a Quaternion based on left vector and angle
    var quate =quat.create();
     quat.setAxisAngle(quate,this.left, angle);
    var newpos = vec3.create();
    vec3.transformQuat(newpos,this.pos,quate);
     vec3.add(this.pos,newpos, this.orbitPoint);
     vec3.subtract(this.dir,this.orbitPoint, this.pos);
    vec3.normalize(this.dir,this.dir);

    // update up vector
     vec3.cross(this.up,this.dir, this.left);
     vec3.normalize(this.up,this.up);

    // update left
   vec3.cross( this.left ,this.up, this.dir);
    vec3.normalize(this.left ,this.left);
  }
}


/**
 Set the closest distance the camera can be from the orbit point.
 
 If 'distance' is greater than the current distance the camera is from
 the orbit point, the camera will be 'backed up' to the new closest
 distance.
 
 @param {float} distance Must be greater than zero and less than or 
 equal to getFarthestDistance().
 */
        OrbitCamera.prototype.setClosestDistance = function (distance)
{
  if (distance >= 0 && distance <= this.getFarthestDistance())
  {
    this.closestDistance = distance;

    // the camera may now be too close, so back it up if necessary.
    var distanceBetweenCamAndOP = this.getDistance();

    // check if the camera's position has been invalidated.
    if (distanceBetweenCamAndOP < this.getClosestDistance())
    {
      // back the camera up to the new closest distance.
      // find how much to back up the camera
      var amt = this.getClosestDistance() - distanceBetweenCamAndOP;

      // back it up
      this.goFarther(amt);
    }
  }
}


/**
 Set the camera 'distance' away from the orbit point. The distance
 must be a value between the getClosestDistance() and getFarthestDistance().
 
 @param {float} distance
 */
OrbitCamera.prototype.setDistance = function (distance)
{
  if (distance >= this.getClosestDistance() && distance <= this.getFarthestDistance())
  {
    // place the camera at the orbit point, then goFarther
    vec3.copy(this.pos,this.orbitPoint);

    this.goFarther(distance);
  }
}


/**
 Set the farthest distance the camera can move away from the orbit point.
 
 If 'distance' is less than the current distance the camera is from
 the orbit point, the camera will be pulled in to the new closest
 distance.
 
 @param {float} distance Must be less than or equal to getClosestDistance().
 */
OrbitCamera.prototype.setFarthestDistance = function (distance)
{
  if (distance >= this.getClosestDistance())
  {
    this.farthestDistance = distance;

    // the camera may be too far from the orbit point, so bring it closer.
    var distanceBetweenCamAndOP = this.getDistance();

    // check if the camera's position has been invalidated.
    if (distanceBetweenCamAndOP > this.getFarthestDistance())
    {
      // back the camera up to the new closest distance.
      // find how much to back up the camera
      var amt = distanceBetweenCamAndOP - this.getFarthestDistance();

      // bring it closer.
      this.goCloser(amt);
    }
  }
}


/**
 Set the point which the camera will orbit and look at.
 
 The direction will remain unchanged.
 
 @param {Array} orbitPoint The new vector the camera will orbit and look at.
 */
OrbitCamera.prototype.setOrbitPoint = function (orbitPoint)
{
  // get the distance the camera was from the orbit point.
  var orbitPointToCam =vec3.create();
   vec3.multiply(orbitPointToCam,this.dir, -this.getDistance());
  this.orbitPoint[0] = orbitPoint[0];
  this.orbitPoint[1] = orbitPoint[1];
  this.orbitPoint[2] = orbitPoint[2];
  vec3.add(this.pos,this.orbitPoint, orbitPointToCam);
}
  



/**
 Yaw about the orbit point. The camera will remain looking at the
 orbit point and its position will rotate about the point parallel to
 the global up axis and intersecting with the orbit point.
 
 @param {float} angle in radians.
 */
OrbitCamera.prototype.yaw = function (angle)
{
  if (isVectorEqual(this.pos, this.orbitPoint))
  {
    // Create a proper Quaternion based on location and angle.
    // we will rotate about the global up axis.
    var quate=quat.create();
    quat.setAxisAngle(quate,[0, 1, 0], angle);
   
    //
     vec3.transformQuat(this.dir, this.dir, quate)  
  vec3.transformQuat(this.left, this.left, quate)  
  vec3.transformQuat(this.up, this.up, quate)  
  vec3.normalize(this.up,this.up);
  vec3.normalize(this.left,this.left);
  vec3.normalize(this.dir,this.dir);
 
  }

  else
  {
    //
    var camPosOrbit =vec3.create();
     vec3.subtract(camPosOrbit,this.pos, this.orbitPoint);

    // Create a rotation matrix based on location and angle.
    // we will rotate about the global up axis.
     var quate=quat.create();
    quat.setAxisAngle(quate,[0, 1, 0], angle);
   
    //
    var newpos = vec3.create();
     vec3.transformQuat(newpos, camPosOrbit, quate);
    
     vec3.add(this.pos,newpos, this.orbitPoint);

    // update direction
      vec3.subtract(this.dir,this.orbitPoint, this.pos);
    vec3.normalize(this.dir,this.dir);

    // update up
    //
    vec3.transformQuat(this.up, this.up, quate)  
    vec3.normalize(this.up,this.up);


    // update left
    vec3.cross(this.left,this.up, this.dir);
    vec3.normalize(this.left,this.left);
 }
}


/**
 Set the camera to a new position. The position must be between the closest
 and farthest distances.
 
 @param {Array} position The new position of the camera.
 */
OrbitCamera.prototype.setPosition = function (position)
{
  var distFromNewPosToOP = vec3.distance(this.orbitPoint, position);

  // make sure the new position of the cam is between the min 
  // and max allowed constraints.	
  if (distFromNewPosToOP >= this.getClosestDistance() && distFromNewPosToOP <= this.getFarthestDistance())
  {
    this.pos[0] = position[0];
    this.pos[1] = position[1];
    this.pos[2] = position[2];
    var camPosToOrbitPoint =vec3.create();
     vec3.subtract(camPosToOrbitPoint,this.orbitPoint, this.pos);

    // if the position was set such that the direction vector is parallel to the global
    // up axis, the cross product won't work. In that case, leave the left vector as it was.
    var tempVec=vec3.create();
    vec3.cross(tempVec,camPosToOrbitPoint, vec3.fromValues(0, 1, 0));
    if (isVectorEqual([0, 0, 0],tempVec))
    {
      // set the direction
      vec3.normalize(this.dir ,camPosToOrbitPoint);
      // the left vector will be perpendicular to the global up
      // axis and direction.
      vec3.cross(this.up ,this.dir, this.left);
    }
    else
    {
      // set the direction
      vec3.subtract(this.dir,this.orbitPoint, this.pos);
      vec3.normalize(this.dir,this.dir);
      // the left vector will be perpendicular to the global up
      // axis and direction.
       vec3.cross(this.left,vec3.fromValues(0, 1, 0), this.dir);
       vec3.cross(this.up,this.dir, this.left);
    }
 }
}




/**
 @private
 
 yaw and pitch can be given velocities later, but for now, this is
 not implemented.
 
 Update Animation of the camera.
 
 @param {float} timeStep
 */
OrbitCamera.prototype.update = function (timeStep)
{
}