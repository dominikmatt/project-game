Camera =function ()
{
  // Raw Position Values
  this.left = vec3.fromValues(1.0, 0.0, 0.0); // Camera Left vector
  this.up = vec3.fromValues(0.0, 1.0, 0.0); // Camera Up vector
  this.dir = vec3.fromValues(0.0, 0.0, 1.0); // The direction its looking at
  this.pos = vec3.fromValues(0.0, 0.0, 0.0); // Camera eye position
  this.projectionTransform = null;
  this.projMatrix;
  this.viewMatrix;

  this.fieldOfView = 55;
  this.nearClippingPlane =0.1;
  this.farClippingPlane = 1000.0;
};

Camera.prototype.apply =function (aspectRatio)
{
  var matView=mat4.create();
  var lookAtPosition=vec3.create();
  vec3.add(lookAtPosition,this.pos, this.dir);
  mat4.lookAt(matView, this.pos, lookAtPosition, this.up);
  mat4.translate(matView,matView,vec3.fromValues(-this.pos[0], -this.pos[1], -this.pos[2]));
  this.viewMatrix = matView;

  // Create a projection matrix and store it inside a globally accessible place.
  this.projMatrix=mat4.create();
  mat4.perspective(this.projMatrix, degToRadian(this.fieldOfView), aspectRatio, this.nearClippingPlane, this.farClippingPlane)

}
/**
 Get the far clipping plane.

 @returns {float} far clipping plane value.
 */
Camera.prototype.getFarClippingPlane =function ()
{
  return this.farClippingPlane;
}
/**
 Get the vertical field of view for this camera in degrees.

 @returns {float} field of view is greater than 0 and less than 180.
 */
Camera.prototype.getFieldOfView =function ()
{
  return this.fieldOfView;
}
/**
 Get the left vector of the camera.

 @returns {Array} vector
 */
Camera.prototype.getLeft =function ()
{
  return vec3.clone(this.left);
}
/**
 Get the near clipping plane.

 @returns {float} near clipping plane value.
 */
Camera.prototype.getNearClippingPlane =function ()
{
  return this.nearClippingPlane;
}
/**
 Get the position of the camera.

 @returns {Array} A three element array which contains the position of the camera.
 */
    Camera.prototype.getPosition =function ()
{
  return vec3.clone(this.pos);
}
/**
 @private
 */
    Camera.prototype.getProjectionMatrix =function ()
{
  return mat4.clone(this.projMatrix);
}

/**
 @private
 */
    Camera.prototype.getViewMatrix =function ()
{
  return mat4.clone(this.viewMatrix);
}
/**
 Get the up vector of the camera.

 @returns {Array}
 */
    Camera.prototype.getUp =function ()
{
  return vec3.clone(this.up);
}
/**
 The far clipping plane should not be set to an extremely large value. This
 can create depth buffer precision problems such as z-fighting. see
 http://www.opengl.org/resources/faq/technical/depthbuffer.htm for more information.

 @param {float} fcp Must be larger than 0.
 */
    Camera.prototype.setFarClippingPlane =function (fcp)
{
  if (fcp > 0)
  {
    this.farClippingPlane = fcp;
  }
}
/**
 Set the field of view for this camera in degrees.

 @param {float} fov Specified in degrees. Must be greater than 0 and less than 180.
 */
    Camera.prototype.setFieldOfView =function (fov)
{
  if (fov > 0 && fov < 180)
  {
    this.fieldOfView = fov;
  }
}

/**
 The near clipping plane must be set to a positive value.

 @param {float} ncp Must be larger than 0.
 */
    Camera.prototype.setNearClippingPlane =function (ncp)
{
  if (ncp > 0)
  {
    this.nearClippingPlane = ncp;
  }
}
/**
 @private

 Called automatically.

 Update Animation of the camera.

 @param {float} timeStep
 */
    Camera.prototype.update =function (timeStep,lineVel,angularVel)
{

  if (vec3.squaredLength(linVel)==0 && vec3.squaredLength(angularVel)==0) return false;

  if (vec3.squaredLength(linVel) > 0.0)
  {
    // Add a velocity to the position
    vec3.scale(velVec,velVec, timeStep);

    vec3.add(this.pos, velVec, this.pos);
  }

  if (vec3.squaredLength(angularVel) > 0.0)
  {
    // Apply some rotations to the orientation from the angular velocity
    this.pitch(angularVel[0] * timeStep);
    this.yaw(angularVel[1] * timeStep);
    this.roll(angularVel[2] * timeStep);
  }

  return true;
  
}

