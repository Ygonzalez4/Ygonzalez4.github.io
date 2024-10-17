let board;
let rows = 20;
let cols = 10;
let blockSize = 30;
let currentPiece;
let nextPiece;
let colors;
let dropInterval = 60; // Intervalo de caída (60 frames = 1 segundo)
let dropTime = 0;
let gameOver = false;
let score = 0;
let bestScore = 0;
let timer; // Temporizador
let timeLimit = 600; // 10 minutos en segundos
let keys = {};
let lastMoveTime = 0;

function setup() {
  createCanvas(cols * blockSize, rows * blockSize);
  resetGame();
  frameRate(60);
}

function draw() {
  drawBackground(); // Llamar a la función para dibujar el fondo
  if (gameOver) {
    displayGameOver();
  } else {
    drawBoard();
    drawNextPiece();
    currentPiece.show();

    // Contar el tiempo para la caída
    dropTime++;
    if (dropTime >= dropInterval) {
      currentPiece.move(1, 0); // Mover la pieza hacia abajo
      dropTime = 0;
    }

    // Controlar el movimiento horizontal de las piezas solo al presionar las teclas
    if (keys['ArrowLeft'] && lastMoveTime + 300 < millis()) { // 300 ms de intervalo
      currentPiece.move(0, -1);
      lastMoveTime = millis();
    }
    if (keys['ArrowRight'] && lastMoveTime + 300 < millis()) {
      currentPiece.move(0, 1);
      lastMoveTime = millis();
    }
    if (keys['ArrowDown'] && lastMoveTime + 300 < millis()) {
      currentPiece.move(1, 0); // Mover más rápido hacia abajo
      lastMoveTime = millis();
    }
  }

  // Rotar la pieza si se presiona la barra espaciadora
  if (keys[' '] && !keys['spacePressed']) {
    currentPiece.rotate();
    keys['spacePressed'] = true; // Marcar que la tecla de espacio está presionada
  }

  // Resetear la tecla de espacio al soltarla
  if (!keys[' ']) {
    keys['spacePressed'] = false; // Desmarcar cuando se suelta la tecla
  }

  // Temporizador
  if (frameCount % 60 === 0 && timer > 0) {
    timer--;
  }

  if (timer === 0) {
    gameOver = true;
  }

  // Mostrar puntuación y tiempo restante
  fill(0);
  textAlign(RIGHT);
  textSize(16);
  textStyle(BOLD);
  text("PTS: " + score, width - 10, 20);
  text("BEST: 🏆 " + bestScore, width - 10, 40);
  text("🕛 ", width - 10, 70);
  text(formatTime(timer), width - 60, 70);
  
  stroke(0);
  strokeWeight(2);
  line(0, 100, width, 100); // Línea divisoria
  noStroke();
}

function drawBackground() {
  // Crear un degradado de blanco a cian
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 255, 0);
    let c = color(inter, 255, 255);
    stroke(c);
    line(0, i, width, i);
  }
}

function drawNextPiece() {
  fill(0);
  textAlign(LEFT);
  textSize(16);
  textStyle(BOLD);
  text("Siguiente Pieza:", 10, 30);
  
  if (nextPiece) {
    nextPiece.showPreview(10, 40);
  }
}

function drawBoard() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] > 0) {
        fill(colors[board[r][c] - 1]);
        stroke(0);
        rect(c * blockSize, r * blockSize, blockSize, blockSize);
      }
    }
  }
  noStroke();
}

class Piece {
  constructor() {
    this.shape = this.getRandomShape();
    this.x = floor(cols / 2) - 1; // Posición horizontal
    this.y = 4; // Comenzar desde la línea 5 (fila 4 en términos de índice)
    this.colorIndex = floor(random(colors.length));
  }

  getRandomShape() {
    const shapes = [
      [[1, 1, 1, 1]], // I
      [[1, 1], [1, 1]], // O
      [[0, 1, 1], [1, 1, 0]], // S
      [[1, 1, 0], [0, 1, 1]], // Z
      [[1, 1, 1], [0, 0, 1]], // L
      [[1, 1, 1], [1, 0, 0]], // J
      [[0, 1, 0], [1, 1, 1]], // T
    ];
    return random(shapes);
  }

  show() {
    fill(colors[this.colorIndex]);
    stroke(0);
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          rect((this.x + c) * blockSize, (this.y + r) * blockSize, blockSize, blockSize);
        }
      }
    }
    noStroke();
  }

  showPreview(x, y) {
    fill(colors[this.colorIndex]);
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          rect(x + c * blockSize, y + r * blockSize, blockSize, blockSize);
        }
      }
    }
  }

  move(dy, dx) {
    this.y += dy;
    this.x += dx;
    if (this.collides()) {
      this.y -= dy;
      this.x -= dx;
      if (dy > 0) {
        if (this.y <= 4) { // Si la pieza toca la línea 5
          gameOver = true;
        }
        this.place();
      }
    }
  }

  rotate() {
    let temp = this.shape;
    this.shape = this.shape[0].map((val, index) =>
      this.shape.map(row => row[index]).reverse()
    );
    if (this.collides()) {
      this.shape = temp;
    }
  }

  collides() {
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          let newX = this.x + c;
          let newY = this.y + r;
          if (newX < 0 || newX >= cols || newY >= rows || (board[newY] && board[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  }

  place() {
    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          board[this.y + r][this.x + c] = this.colorIndex + 1;
        }
      }
    }
    this.clearLines();
    currentPiece = nextPiece; // Usar la siguiente pieza como pieza actual
    nextPiece = new Piece(); // Crear nueva siguiente pieza
  }

  clearLines() {
    let linesCleared = 0;
    for (let r = rows - 1; r >= 0; r--) {
      if (board[r].every(cell => cell > 0)) {
        board.splice(r, 1);
        board.unshift(Array(cols).fill(0));
        linesCleared++;
      }
    }
    if (linesCleared > 0) {
      score += linesCleared * 100; // Sumar 100 puntos por cada línea borrada
    }
  }
}

function displayGameOver() {
  fill(0);
  textAlign(CENTER);
  textSize(32);
  textStyle(BOLD);
  text("💀 TE MORISTE 💀", width / 2, height / 2 - 20);
  textSize(16);
  text("PUNTUACIÓN: " + score, width / 2, height / 2 + 10);
  if (score > bestScore) {
    bestScore = score;
    text("NEW RECORD!", width / 2, height / 2 + 40);
  }
  text("PULSA R PARA REINICIAR", width / 2, height / 2 + 60);
}

function resetGame() {
  board = Array.from({ length: rows }, () => Array(cols).fill(0));
  colors = ['cyan', 'blue', 'orange', 'yellow', 'green', 'purple', 'red'];
  currentPiece = new Piece();
  nextPiece = new Piece(); // Crear la primera siguiente pieza
  gameOver = false;
  score = 0;
  timer = timeLimit; // Reiniciar el temporizador
}

function keyPressed() {
  if (gameOver) {
    if (key === 'r' || key === 'R') {
      resetGame();
    }
    return;
  }

  keys[key] = true; // Marcar la tecla como presionada
}

function keyReleased() {
  keys[key] = false; // Marcar la tecla como no presionada
}

function formatTime(seconds) {
  let min = floor(seconds / 60);
  let sec = seconds % 60;
  return nf(min, 2) + ':' + nf(sec, 2);
}
