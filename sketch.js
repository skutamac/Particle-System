let systems = [];
let alignSlider, cohesionSlider, separationSlider, homeSlider, maxSpeedSlider, minSpeedSlider, rotationSlider;
let newFlow = [];
let bgcol;
let touchHoldTime;
let alignSliderName,cohesionSliderName, separationSliderName, homeSliderName, maxSpeedSliderName, minSpeedSliderName, rotationSliderName;

p5.disableFriendlyErrors = true; // disables FES



function setup() {
  colorMode(HSL, 360, 100, 100, 1);
  bgcol = color(0,0,20,1);

  canvas = createCanvas(1200,800);
  canvas.position(150,20);


  // Create and display the control panel to control particle beahviours

  createP('Control Panel');
  alignSliderName = createP('  Align Strenth = ');
  alignSlider = createSlider(0, 100, 10);
  cohesionSliderName = createP('  Cohesion Strength');
  cohesionSlider = createSlider(0, 100, 20);
  separationSliderName = createP('  Separation Strength');
  separationSlider = createSlider(0, 100, 40);
  homeSliderName = createP('  Home Size');
  homeSlider = createSlider(0, 200, 100);
  maxSpeedSliderName = createP('Maximum Speed');
  maxSpeedSlider = createSlider(0, 10, 5, 0.1);
  minSpeedSliderName = createP('Minimum Speed');
  minSpeedSlider = createSlider(0, 10, 2, 0.1);
  rotationSliderName = createP('Orbit Stregth');
  rotationSlider = createSlider(0, HALF_PI, HALF_PI / 2, 0.1);


  flowField = new forceField(20, 0, 0);
  let start = createVector(100,300);
  let end = createVector(300,100)


}


function draw() {

  alignSliderName.html('  Align Strenth = ' + alignSlider.value());
  cohesionSliderName.html('  Cohesion Strenth = ' + cohesionSlider.value());
  separationSliderName.html('  Separation Strenth = ' + separationSlider.value());
  homeSliderName.html('  Home Size = ' + homeSlider.value());
  maxSpeedSliderName.html('  Maximum Speed = ' + maxSpeedSlider.value());
  minSpeedSliderName.html('  Minimim Speed = ' + minSpeedSlider.value());
  rotationSliderName.html('  Orbit Strenth = ' + rotationSlider.value());





  background(bgcol);

  //run the particle systems
  for (let system of systems){
    system.run(flowField);
  }

  //force field development area
  if(flowField.display){
    flowField.show();
  }
}


function mouseDragged(){

  flowField.warp(mouseX, mouseY, 100, 20);

}

function touchStarted(){
  doubleClicked();
}


function doubleClicked(){
  // if no key is being pressed then spawn a new group of particles at the location where mouse is pressed
  if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
    systems.push(new ParticleSystem(mouseX, mouseY));
    systems[systems.length - 1].burstParticles();
  }
}


function keyPressed(){
  if (keyCode === 70){
    flowField.display = !flowField.display;
  }
}
