class Particle{

  constructor(x, y, vx, vy){
    this.loc = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector();
    this.lifespan = 100
    this.decayRate = 0.1;
    this.remainLife = 1
    this.shape = "ROUND";
    this.r = 5;
    this.mass = 1;
    this.col = color(x*360/width, 100 * y / height,50,1);
    this.min_speed = 2;
    this.max_speed = 5;
    this.max_force = 0.05;
    this.path = [];
    this.pathlen = 30;
    this.separationWeight = 4;
    this.alignWeight = 1;
    this.cohesionWeight = 2;
    this.safeRange = 100;
    this.homeRotation = HALF_PI / 2;
    this.flocking = true;
    this.seeking = true;
    this.bouncing = true;
    this.fielding = true;

  }

  run(particles, home, field){
    if(this.seeking){
      let home_steer = this.seek(home);
      this.applyForce(home_steer);
    }
    if(this.fielding){
      let field_steer = this.forceField(field);
      this.applyForce(field_steer);
    }
    if(this.flocking){
      this.flock(particles);
    }
    if(this.bouncing){
      this.bounce();
    }
    this.remainLife -= this.decayRate/this.lifespan;
    this.update();
    this.show();
  }

  update(){
    let previous = createVector(this.loc.x, this.loc.y);
    this.path.push(previous);
    if(this.path.length > this.pathlen){
      this.path.splice(0, 1);
    }
    this.vel.add(this.acc);
    this.vel.limit(this.max_speed);
    if(this.vel.mag() < this.min_speed){
      this.vel.mag(this.min_speed);
    }
    this.loc.add(this.vel);
    this.acc.mult(0);

  }

  show(){
    this.renderTail();
    noStroke();
    fill(this.col);
    this.plot(this.loc.x, this.loc.y, this.r);
  }

  renderTail(){
    let tailCol = this.col;
    for(let i = this.path.length - 1; i > 0; i--){
      tailCol.setAlpha(this.remainLife * i / this.path.length);
      noStroke();
      fill(tailCol);
      this.plot(this.path[i].x, this.path[i].y, i * this.r / this.path.length);
    }
  }

  plot(x, y, r){
      if (this.shape == "ROUND"){
        ellipse(x, y, r);
      }
      if (this.shape == "SQUARE"){
        rectMode(RADIUS);
        rect(x, y, r);
      }

  }

  applyForce(f){
    f.div(this.mass);
    this.acc.add(f);
  }

  bounce(){
    if (this.loc.y < 0){
      this.loc.y = 0;
      this.vel.y = -this.vel.y;
    }
    if (this.loc.y > height){
      this.loc.y = height;
      this.vel.y = -this.vel.y;
    }
    if (this.loc.x < 0){
      this.loc.x = 0
      this.vel.x = -this.vel.x;
    }
    if (this.loc.x > width){
      this.loc.x = width;
      this.vel.x = -this.vel.x;
    }
  }

  isDead(){
    if(this.remainLife < 0 ){
      return true;
    } else {
      return false;
    }
  }

  forceField(field){
    let f;
    if(this.loc.x > 0 && this.loc.x < width && this.loc.y > 0 && this.loc.y < height){
      let gridCol = floor(this.loc.x / field.res);
      let gridRow = floor(this.loc.y / field.res);
      f = field.grid[gridCol][gridRow].copy();
      f.limit(this.max_force);

    } else {

      f = createVector(0,0);

    }

    return f;

  }



  seek(target){
    let desired = p5.Vector.sub(target, this.loc); // A vector pointing from the location to the target
    //if desired is with range of safe home then set speed to min speed
    let dist = desired.mag();
    if(desired.mag() < this.safeRange){
      desired.normalize();
      desired.mult(this.min_speed);
      let ang = map(dist, 0, this.safeRange, this.homeRotation, 0);
      desired.rotate(ang);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.max_force); // Limit to maximum steering force
      return steer;
    } else {
      // Normalize desired and scale to maximum speed
      desired.normalize();
      desired.mult(this.max_speed);
      let steer = p5.Vector.sub(desired, this.vel);
      steer.limit(this.max_force); // Limit to maximum steering force
      return steer;
    }
    // Steering = Desired minus Velocity
  }

  flock(particles){
    let desiredseparation = 20.0;
    let neighbordist = 50;
    let sep_count = 0;
    let align_count = 0;
    let cohesion_count = 0;
    let sep_steer = createVector(0,0);
    let align_sum = createVector(0, 0);
    let align_steer = createVector(0, 0);
    let cohesion_sum = createVector(0, 0); // Start with empty vector to accumulate all locations
    let cohesion_steer = createVector(0, 0);

    //Loop through all particles
    for (let i = 0; i < particles.length; i++) {

      let d = p5.Vector.dist(this.loc, particles[i].loc);

      if ((d > 0) && (d < desiredseparation)) {
        let diff = p5.Vector.sub(this.loc, particles[i].loc);
        diff.normalize();
        diff.div(d); // Weight by distance
        sep_steer.add(diff);
        sep_count++; // Keep track of how many
      }

      if ((d > 0) && (d < neighbordist)) {
        align_sum.add(particles[i].vel);
        align_count++;
        cohesion_sum.add(particles[i].loc); // Add location
        cohesion_count++;
      }
    }

    //Process separation force
    if (sep_count > 0) {
      sep_steer.div(sep_count);
    }

    // As long as the vector is greater than 0
    if (sep_steer.mag() > 0) {
      // Implement Reynolds: Steering = Desired - Velocity
      sep_steer.normalize();
      sep_steer.mult(this.max_speed);
      sep_steer.sub(this.vel);
      sep_steer.limit(this.max_force);
      }

    //Process alignment force
    if (align_count > 0) {
      align_sum.div(align_count);
      align_sum.normalize();
      align_sum.mult(this.max_speed);
      align_steer = p5.Vector.sub(align_sum, this.vel);
      align_steer.limit(this.max_force);
    } else {
      align_steer = createVector(0, 0);
    }

    //Process cohesion force
    if (cohesion_count > 0) {
      cohesion_sum.div(cohesion_count);
      cohesion_steer = this.seek(cohesion_sum); // Steer towards the location
    } else {
      cohesion_steer = createVector(0, 0);
    }
    this.applyForce(sep_steer.mult(this.separationWeight));
    this.applyForce(align_steer.mult(this.alignWeight));
    this.applyForce(cohesion_steer.mult(this.cohesionWeight));
    //Apply all forces
    // this.applyForce(sep_steer);
    // this.applyForce(align_steer);
    // this.applyForce(cohesion_steer);
  }
}
