Sprite= inherit(StageObject, function (){
    superc(this);
    this.geometry=new SquareGeometry();
    var currentDate=new Date();
    this.textureIndex=currentDate.getMilliseconds();
    this.materialFile=this.textureIndex;
    this.canvasId="c_"+this.textureIndex;
    jQuery("body").append("<canvas id='"+this.canvasId+"' style='display:none'></canvas>");
    this.spriteTexture=new SpriteTexture(this.canvasId);
    this.backgroundColor="#ffffff";
    this.color="#333333";

    this.scale=vec3.fromValues(10,10,10);

});
Sprite.prototype.drawText=function(text){
    this.spriteTexture.backgroundColor=this.backgroundColor;
    this.spriteTexture.color=this.color;
    this.spriteTexture.createTexture(text);
}

