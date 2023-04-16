let systems = [];
let controlPanel;
let alignSlider, cohesionSlider, separationSlider, homeSlider, maxSpeedSlider, minSpeedSlider, rotationSlider;
// let newFlow = [];
let bgcol;
let touchHoldTime;
let alignSliderName,cohesionSliderName, separationSliderName, homeSliderName, maxSpeedSliderName, minSpeedSliderName, rotationSliderName;
let stepTime = 50;
let lastStep = 0;
let step;


// p5.disableFriendlyErrors = true; // disables FES



function setup() {
  colorMode(HSL, 360, 100, 100, 1);
  bgcol = color(0,0,20,1);

  canvas = createCanvas(1200,800);
  canvas.position(150,20);

  // Create and display the control panel to control particle beahviours
  controlPanel = new ControlPanel();
  controlPanel.createPanel();
  controlPanel.addSlider('align','Align Weight = ', 0, 100, 10);
  controlPanel.addSlider('cohesion','Cohesion Weight = ', 0, 100, 20);
  controlPanel.addSlider('separation','Separation Weight = ', 0, 100, 40);
  controlPanel.addSlider('home','Home Size = ', 0, 200, 100);
  controlPanel.addSlider('maxSpeed','Maximum Speed = ', 0, 10, 5, 0.1);
  controlPanel.addSlider('minSpeed',' Minimum Speed = ', 0, 10, 2, 0.1);
  controlPanel.addSlider('rotation',' Rotation = ', 0, HALF_PI, HALF_PI / 2, HALF_PI/20);


  //setup the force field
  flowField = new forceField(20, 0, 0);


  // frameRate(30);


}


function draw() {
  //time stepping
  if(millis() > (lastStep + stepTime)){
    lastStep = millis();
    step = true;
  }
  else {
    step = false;
  }

  if (step == true){

  // wipe screen
  background(bgcol);

  //logging
  // console.clear();
  // console.log(frameRate());
  let particleCount = 0;

  for (let system of systems){
    particleCount = particleCount + system.particles.length;
  }
  console.log(particleCount);

  //update the Control Panel
  controlPanel.refreshPanel();




  //run the particle systems
  for (let system of systems){
    system.run(flowField);
  }

  //force field development area
  if(flowField.display){
    flowField.show();
  }
}
}


function mouseDragged(){

  flowField.warp(mouseX, mouseY, 100, 40);

}

// function touchStarted(){
//   doubleClicked();
// }


function doubleClicked(){
  // if no key is being pressed then spawn a new group of particles at the location where mouse is pressed
  if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
    systems.push(new ParticleSystem(mouseX, mouseY));
    systems[systems.length - 1].burstParticles();
  }
}


function keyPressed(){
  //key 'f' toggles field display
  if (keyCode === 70){
    flowField.display = !flowField.display;
  }
  //key 'c' clears field
  if (keyCode === 67){
    flowField.reset();
  }
  //key 'k' toggles flocking behaviour for all systems
  if (keyCode === 75){
    for (let system of systems){
      system.toggleFlocking();
    }
    }
  //key 'h' toggles seeking behaviour for all systems
  if (keyCode === 72){
    for (let system of systems){
      system.toggleSeeking();
    }
    }






}
