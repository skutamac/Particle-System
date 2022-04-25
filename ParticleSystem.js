class ParticleSystem{

constructor(x, y){
	this.origin = createVector(x, y);
	this.particles = [];
	this.burstMag = 50;
	this.flock = true;


}


burstParticles(){
	for (let i = 0; i < this.burstMag; i++){
		this.addParticle();
	}
}

addParticle(){
	this.particles.push(new Particle(this.origin.x, this.origin.y, random(-4, 4), random(-4, 4)));
}

// applyForce(f){
// 	for (let particle of this.particles){
// 		particle.applyForce(f);


// 	}
// }

run(field){

	for (let particle of this.particles){
		particle.run(this.particles, this.origin, field);
	}
	this.particles = this.particles.filter(particle => !particle.isDead());
}

}
