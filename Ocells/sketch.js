let mic;
function setup() {
  createCanvas(700, 350);
  mic=new p5.AudioIn();
  mic.start();
  
}

function draw() {
  let vol=mic.getLevel();
  let h=map(vol,0,1,0,300)
  background(220);
  //es la lengua---------------------------------------------------
 fill(255,0,0);
  ellipse(155,81,30,10)
  //es el pajaro de la izquierda-----------------------------------
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
  //es el ojo------------------------------------------------------
  fill(0,0,0);
  ellipse (130,70,20,20);
  //el la lengua---------------------------------------------------
   fill(255,0,0);
  ellipse(545,81,30,10);
  //es el pajaro de la derecha-------------------------------------
   fill(0-h*15,150+h*15,155+h*15);
  beginShape();
  vertex(620,300);
  vertex(600,30);
  vertex(450,80-h*6);
  vertex(550,81);
  vertex(450,80+h*6);
  vertex(540,120);
  vertex(500,300);
  vertex(620,300);
  endShape();
//es el ojo--------------------------------------------------------
  fill(0,0,0);
  ellipse (570,70,20,20);
  //es la corbata--------------------------------------------------
 beginShape();
  vertex(135,140);
  vertex(155,140);
  vertex(150,150);
  vertex(155,180);
  vertex(145,190);
  vertex(135,180);
  vertex(140,150)
  endShape();
  //es el collar---------------------------------------------------
 fill(255,255,255);
 ellipse(540,130,15,15)
 ellipse(550,135,15,15)
 ellipse(560,136,15,15)
 ellipse(570,136,15,15)
 ellipse(580,136,15,15)
 ellipse(590,135,15,15)
 ellipse(600,131,15,15)
  
  
  
}
