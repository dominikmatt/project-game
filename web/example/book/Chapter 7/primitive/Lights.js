Lights = function ( ) {


    this.lights=[];



};
Lights.prototype = {

    constructor: Lights,
    addLight:function(light){
        this.lights.push(light);
    },
    getDataByType:function(type,lightType){
        var sum=[];

        if(type=="position"){
         for(var i=0;i<this.lights.length;++i){
             if(this.lights[i].position.length>0){
                 sum=sum.concat(this.lights[i][type])
             }
         }

        } else if(type=="direction"){
            for(var i=0;i<this.lights.length;++i){
                if(this.lights[i].direction.length>0){
                   sum= sum.concat(this.lights[i][type])
                }
            }

        }
        else if(type=="ambientColor"){
            sum=[0,0,0];
            for(var i=0;i<this.lights.length;++i){

                    sum[0]=sum[0]+this.lights[i].ambientColor[0];
                sum[1]=sum[1]+this.lights[i].ambientColor[1];
                sum[2]=sum[2]+this.lights[i].ambientColor[2];


            }
        }
        else{
            //Since in our shader we expect color(diffuse and specular) of directional lights first then positional lights
            for(var i=0;i<this.lights.length;++i){
                if(this.lights[i][lightType].length>0){
                    sum= sum.concat(this.lights[i][type])
                }


            }




        }
        return sum;
    }
}
