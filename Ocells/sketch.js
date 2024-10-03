let mic;
function setup() {
  createCanvas(300, 350);
  mic=new p5.AudioIn();
  mic.start();
}

function draw() {
  let vol=mic.getLevel();
  let h=map(vol,0,1,0,300)
  background(220);
 fill(255,0,0);
  ellipse(155,81,30,10)
  fill(227-h*15,190+h*15,10+h*15);
  beginShape();
  vertex(80,300);
  vertex(100,30);
  vertex(250,80-h*6);
  vertex(150,81);
  vertex(250,80+h*6);
  vertex(160,120);
  vertex(200,300);
  vertex(80,300);
  endShape(close);
  fill(0,0,0);
  ellipse (130,70,20,20)
  fill(242,240,235);
  ellipse(250,300,20,30);
  
  
}



