SpriteTexture = function (elemId) {

    this.canvas = document.getElementById(elemId);
    this.ctx = this.canvas.getContext('2d');
    this.textSize=56;
    	// This determines the baseline of the text, e.g. top, middle, bottom
    this.maxWidth=256;
    this.backgroundColor="#ffffff";
    this.color="#333333";
    this.powerColor="#FF0000";
    this.power=7;
    this.sqaureTexture=false;
}
SpriteTexture.prototype.powerOfTwo=function(value, pow) {
    var pow = pow || 1;
    while(pow<value) {
        pow *= 2;
    }
    return pow;
}



SpriteTexture.prototype.createTexture=function(textData){
    var text=[];
    var width=0;
    var canvasX=0;
    var canvasY=0;
    this.ctx.font=this.textSize +"px Georgia";
    if (this.maxWidth && this.measureText(textData) > this.maxWidth ) {
        width = this.createMultilineText(textData,text);
        canvasX = this.powerOfTwo(width);
    } else {
        text.push(textData);
        canvasX = this.powerOfTwo(this.ctx.measureText(textData).width);
    }
    canvasY = this.powerOfTwo(this.textSize*(text.length+1)+30);//+30 for power stats
    if(this.sqaureTexture){
    (canvasX > canvasY) ? canvasY = canvasX : canvasX = canvasY;//For squaring the texture
    }
    this.canvas.width = canvasX;
    this.canvas.height = canvasY;
    var textX = canvasX/2;
    var textY = canvasY/2;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    var offset = (canvasY - this.textSize*(text.length+1)) * 0.5;
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    this.ctx.fillStyle = this.color; 	// This determines the text colour, it can take a hex value or rgba value (e.g. rgba(255,0,0,0.5))
    this.ctx.textAlign = "center";	// This determines the alignment of text, e.g. left, center, right
    this.ctx.textBaseline = "middle";
    this.ctx.font=this.textSize +"px Georgia";

    for(var i = 0; i < text.length; i++) {
        if(text.length > 1) {
            textY = (i+1)*this.textSize + offset;
        }
        this.ctx.fillText(text[i], textX,  textY);
    }
    this.ctx.fillStyle = this.powerColor;
    this.ctx.fillRect(0, this.canvas.height-60, this.power*this.ctx.canvas.width/10, 30);


}
SpriteTexture.prototype.measureText=function(textToMeasure) {
    return this.ctx.measureText(textToMeasure).width;

}
SpriteTexture.prototype.createMultilineText=function(textData,text) {
    textData = textData.replace("\n"," ");
    var currentText = textData;
    var newText;
    var subWidth = 0;
    var maxLineWidth = 0;

    var wordArray = textData.split(" ");
    var wordsInCurrent, wordArrayLength;
    wordsInCurrent = wordArrayLength = wordArray.length;

    while (this.measureText(currentText) > this.maxWidth && wordsInCurrent > 1) {
        wordsInCurrent--;
        var linebreak = false;

        currentText = newText = "";
        for(var i = 0; i < wordArrayLength; i++) {
            if (i < wordsInCurrent) {
                currentText += wordArray[i];
                if (i+1 < wordsInCurrent) { currentText += " "; }
            }
            else {
                newText += wordArray[i];
                if( i+1 < wordArrayLength) { newText += " "; }
            }
        }
    }
    text.push(currentText);
    maxLineWidth = this.measureText(currentText);

    if(newText) {
        subWidth = this.createMultilineText(newText,text);
        if (subWidth > maxLineWidth) {
            maxLineWidth = subWidth;
        }
    }
    return maxLineWidth;
}