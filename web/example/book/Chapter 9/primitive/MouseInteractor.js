function MouseInteractor(camera,canvas){

    this.camera = camera;
    this.canvas = canvas;


    this.dragging = false;
    this.x = 0;
    this.y = 0;
    this.lastX = 0;
    this.lastY = 0;
    this.button = 0;
    this.shift = false;
    this.key = 0;

    this.SENSITIVITY = 0.7;
    this.setUp();
}
MouseInteractor.prototype.setUp=function(){
    var self=this;
    this.canvas.onmousedown = function(ev) {
        self.onMouseDown(ev);
    }

    this.canvas.onmouseup = function(ev) {
        self.onMouseUp(ev);
    }

    this.canvas.onmousemove = function(ev) {
        self.onMouseMove(ev);
    }
}

MouseInteractor.prototype.onMouseUp = function(evnt){
    this.dragging = false;
}

MouseInteractor.prototype.onMouseDown = function(evnt){
    this.dragging = true;
    this.x = evnt.clientX;
    this.y = evnt.clientY;
    this.button = evnt.button;
}

MouseInteractor.prototype.onMouseMove = function(event){
    this.lastX = this.x;
    this.lastY = this.y;
    this.x = event.clientX;
    this.y = event.clientY;

    if (!this.dragging) return;
    this.shift = event.shiftKey;



    if (this.button == 0) {
        if(this.shift){
            var dx=this.mousePosX(this.x) -this.mousePosX(this.lastX)
            var dy=this.mousePosY(this.y) -this.mousePosY(this.lastY)

            this.rotate(dx,dy);
        }
        else{
            var dy = this.y - this.lastY;
            this.translate(dy);
        }
    }

}
MouseInteractor.prototype.mousePosX=function(x){
    return 2 * (x / this.canvas.width) - 1;
}
MouseInteractor.prototype.mousePosY=function(y){
    return 2 * (y / this.canvas.height) - 1;
}

MouseInteractor.prototype.translate = function(value){

    var translateSensitivity=30 * this.SENSITIVITY;
    var c = this.camera;
    var dv = translateSensitivity * value / this.canvas.height;
    if(c instanceof OrbitCamera){
        if(dv>0){
            c.goFarther(dv);
        }
        else{
            c.goCloser(-dv);
        }
    }
    else{
        c.moveForward(dv);
    }

}

MouseInteractor.prototype.rotate = function(dx, dy){
    var camera = this.camera;
    camera.yaw(this.SENSITIVITY*dx);
    camera.pitch(this.SENSITIVITY*dy);
}

