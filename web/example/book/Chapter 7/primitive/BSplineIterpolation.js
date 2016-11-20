function BSplineInterpolation(controlPoints){

    this.position = [];
    this.controlPoints=controlPoints;
    this.N = this.controlPoints.length - 1;
    this.P = 3;  //Degree
    this.U = []; //Knot Vector
    this.M = this.N + this.P + 1; //number of elements in the knot vector
    this.deltaKnot = 1/(this.M-(2*this.P));

    //Creating the knot vector (clamped):
    //http://web.mit.edu/hyperbook/Patrikalakis-Maekawa-Cho/node17.html
    for (var i = 0; i <= this.P; i++){
        this.U.push(0);
    }

    this.v = this.deltaKnot;
    for (var i = this.P+1; i< this.M-this.P+1; i++){
        this.U.push(this.v);
        this.v += this.deltaKnot;
    }

    for (var i = this.M-this.P+1; i<= this.M; i++){
        this.U.push(1);
    }
    var dT = 1/200;
    var t = 0;
    do{
        this.position.push(this.C(t));
        t += dT;
    } while(t<1.0);
    this.position.push(this.C(1.0));
};


    // Bo function
BSplineInterpolation.prototype.No=function(u,i){
        if (this.U[i] <= u && u < this.U[i+1]){
            return 1;
        }
        else {
            return 0;
        }
    }

    // Bp function
BSplineInterpolation.prototype.Np=function(u,i,p){
        var A = 0;
        var B = 0;
        if (p-1 == 0) {
            A = this.No(u,i);
            B = this.No(u, i+1);
        } else {
            A = this.Np(u,i,p-1);
            B = this.Np(u,i+1, p-1);
        }

        var coeffA = 0;
        var coeffB = 0;
        if ( this.U[i+p] - this.U[i] != 0 ) 	  {coeffA = (u - this.U[i])/(this.U[i+p] -this.U[i]);}
        if ( this.U[i+p+1] - this.U[i+1] != 0 ) {coeffB = (this.U[i+p+1] - u)/(this.U[i+p+1] - this.U[i+1]);}
        return coeffA*A + coeffB*B;
    }

BSplineInterpolation.prototype.C=function(t){
        var result = [];
        for (var j = 0; j <3; j++){         //iterate over axes
            var sum = 0;
            for (var i = 0; i <= this.N; i++){    //iterate over control points
                sum += this.controlPoints[i][j] * this.Np(t,i,this.P);
            }
            result[j] = sum;
        }
        return result;
    }





