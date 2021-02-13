class forceField{

	constructor(resolution, globalX, globalY){
		this.cols = width / resolution ;
		this.rows = height / resolution;
		this.res = resolution;
		this.grid = [];
		this.display = false;
		this.warpDir = createVector(0,0);
		for (let i = 0; i < this.cols; i++){
			this.grid[i] = [];
			for (let j = 0; j < this.rows; j++){
				this.grid[i][j] = createVector(globalX, globalY);

			}
		}


	}

	show(){
		stroke(255);
		strokeWeight(1);
		for (let i = 0; i < this.cols; i++){
			stroke (127);
			line(this.res * (i + 1), 0, this.res * (i+1), height);
			for (let j = 0; j < this.rows; j++){
				if(i == 0){
					line(0, this.res * (j + 1), width, this.res * (j + 1));
				}
				point((i + 0.5) * this.res, (j + 0.5) * this.res);
				line((i + 0.5) * this.res, (j + 0.5) * this.res, (i + 0.5) * this.res + this.grid[i][j].x, (j + 0.5) * this.res + this.grid[i][j].y);
				

			}
		}
	}

	warp(wx, wy, size, strength){
		for (let i = 0; i < this.cols; i++){
			for (let j = 0; j < this.rows; j++){
				let warpVect = createVector(wx - (i + 0.5) * this.res, wy - (j + 0.5) * this.res);
				if (warpVect.mag() < size){
					this.grid[i][j] = warpVect.mult(strength / warpVect.mag() * 0.5);
				}	
			}
		}
	}







}
	

