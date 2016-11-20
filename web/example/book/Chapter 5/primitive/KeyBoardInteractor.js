function KeyBoardInteractor(camera,canvas){

    this.cam = camera;
    this.canvas = canvas;



    this.setUp();
}
KeyBoardInteractor.prototype.setUp=function(){
    var self=this;
    this.canvas.onkeydown = function(event) {

        self.handleKeys(event);
    }

}

KeyBoardInteractor.prototype.handleKeys=function (event) {
    if(event.shiftKey) {
        switch(event.keyCode) {//determine the key pressed
            case 65://a key
                this.cam.roll(-Math.PI * 0.025);//tilt to the left
                break;
            case 37://left arrow
                this.cam.yaw(Math.PI * 0.025);//rotate to the left
                break;
            case 68://d key
                this.cam.roll(Math.PI * 0.025);//tilt to the right
                break;
            case 39://right arrow
                this.cam.yaw(-Math.PI * 0.025);//rotate to the right
                break;
            case 83://s key
            case 40://down arrow
                this.cam.pitch(Math.PI * 0.025);//look down
                break;
            case 87://w key
            case 38://up arrow
                this.cam.pitch(-Math.PI * 0.025);//look up
                break;
        }
    }
    else {
        var pos = this.cam.getPosition();
        if(this.cam instanceof OrbitCamera){
            switch(event.keyCode) {//deterime the key pressed
                case 65://a key
                case 37://left arrow
                break;
                case 68://d key
                case 39://right arrow
                break;
                case 83://s key
                break;
                case 40://down arrow
                this.cam.goFarther(10);//move + on the Z axis
                break;
                case 38://up arrow
                this.cam.goCloser(10);//move - along the Y axis (down)
                break;
            }
        }
        else
        {
            switch(event.keyCode) {//deterime the key pressed
                case 65://a key
                case 37://left arrow
                    this.cam.setPosition([pos[0]-10,pos[1],pos[2]]);//move - along the X axis
                    break;
                case 68://d key
                case 39://right arrow
                    this.cam.setPosition([pos[0]+10,pos[1],pos[2]]);//more + along the X axis
                    break;
                case 83://s key
                    this.cam.setPosition([pos[0],pos[1]-10,pos[2]]);//move - along the Y axis (down)
                    break;
                case 40://down arrow
                    this.cam.setPosition([pos[0],pos[1],pos[2]+10]);//move + on the Z axis
                    break;
                case 87://w key
                    this.cam.setPosition([pos[0],pos[1]+10,pos[2]]);//move + on the Y axis (up)
                    break;
                case 38://up arrow
                    this.cam.setPosition([pos[0],pos[1],pos[2]-10]);//move - on the Z axis
                    break;
            }

        }
    }

}
