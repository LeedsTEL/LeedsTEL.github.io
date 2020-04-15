function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cols, rows;
var w;
var grid = [];
var current;
var finished = false;
var stack = [];
var hitboxes = [];
var curr = [];
var prev = [];
var angles = [112.5 * Math.PI / 180, 67.5 * Math.PI / 180, 292.5 * Math.PI / 180, 247.5 * Math.PI / 180];
var wallImg, stomachImg, batteryImg, helpBtnImg, helpBtnImgH, helpImg, winningImg;
var cellSize = 100;
var imgScale = cellSize * 1.2 / 256;
var batteryImgW = imgScale * 0.7 * 70;
var batteryImgH = imgScale * 0.7 * 169;
var batteryRad = Math.sqrt(Math.pow(batteryImgW, 2) + Math.pow(batteryImgH, 2)) / 2;
var gridW = 900;
var gridH = 2000;
var scroll = 0;
var scrollVal = 0;
var startRotation = Math.floor(Math.random() * (Math.PI / 2)) - Math.PI / 4;
var rotation = startRotation;
var hitBoxWidth = 0.8;
var hitBoxHeight = 0.5;
var batteryHitBox;
var activeHitboxes = [];
var progress = 0;
var bubbleGrowth = 0;
var growBubble = false;
var startFrame = 0;
var bubbleGrowDuration = 70;
var backgroundFade = 0;
var dropBattery = true;
var battDrop = 0;
var battStartFrame = 0;
var battDropDuration = 70;
var showHelp = false;
var hideHelp = false;
var helpFade = 0;
var helpStartFrame = 0;
var helpFadeDuration = 20;
var showWin = false;
var hideWin = false;
var winFade = 0;
var winStartFrame = 0;
var winFadeDuration = 20;
var startTimer = true;
var startRound = 0;
var time = 0;
var starting = true;
var offsetX, offsetY;
var grabbing = false;
var gameOver = false;
var win = false;
var showHitboxes = false;
var noclip = false;
var helpBtn;
var aishaBold;

function preload() {
  wallImg = loadImage('IntestineWallDetail.png');
  stomachImg = loadImage('Stomach.png');
  batteryImg = loadImage('Battery.png');
  helpBtnImg = loadImage('HelpButton.png');
  helpBtnImgH = loadImage('HelpButtonHighlight.png');
  helpImg = loadImage('BowelHelp.png');
  gameOverImg = loadImage('GameOver.png');
  winningImg = loadImage('WinningBattery.png');
}

function setup() {
  var cnv = createCanvas(windowWidth, windowHeight);
  cnv.style('display', 'block');
  gridW = Math.min(900, ceil(width / 100 * 0.7) * 100);

  if (gridW / 100 % 2 === 0) {
    gridW -= 100;
  }

  textAlign(CENTER, CENTER);
  genMaze(cellSize);
  wallImg.resize(imgScale * 256, imgScale * 128);
  stomachImg.resize(imgScale * 900, imgScale * 1000);
  batteryImg.resize(batteryImgW, batteryImgH);
  batteryHitBox = new hitBox(createVector(gridW / cellSize / 2 * 100, -400), imgScale * 0.7 * 70, imgScale * 0.7 * 169);
  helpBtnImg.resize(imgScale * 256, imgScale * 256);
  helpBtnImgH.resize(imgScale * 256, imgScale * 256);
  helpBtn = new Button(createVector(gridW - cellSize, -3 * cellSize), helpBtnImg, helpBtnImgH, 256 * imgScale, 256 * imgScale);
  console.log(batteryHitBox.point.y);
  scroll = -70 * -1 / height * (gridH + 350);
  activeHitboxes.push(new hitBox(createVector(0, 0), 0, 0));
  activeHitboxes[0].points = [createVector(0, -100), createVector(floor(gridW / 100 / 2) * 100 + imgScale * 128 * hitBoxHeight / 2, -100), createVector(floor(gridW / 100 / 2) * 100 + imgScale * 128 * hitBoxHeight / 2, 0), createVector(0, 0)];
  activeHitboxes[0].recalcEdges();
  activeHitboxes.push(new hitBox(createVector(0, 0), 0, 0));
  activeHitboxes[1].points = [createVector(gridW, -100), createVector(floor(gridW / 100 / 2) * 100 + 105 - imgScale * 128 * hitBoxHeight / 2, -100), createVector(floor(gridW / 100 / 2) * 100 + 105 - imgScale * 128 * hitBoxHeight / 2, 0), createVector(gridW, 0)];
  activeHitboxes[1].recalcEdges();
  activeHitboxes.push(new hitBox(createVector(0, 0), 0, 0));
  activeHitboxes[2].points = [createVector(0, -200), createVector(floor(gridW / 100 / 2) * 100 - 80 - imgScale * 128 * hitBoxHeight / 2, -200), createVector(floor(gridW / 100 / 2) * 100 + imgScale * 128 * hitBoxHeight / 2, -100), createVector(0, -100)];
  activeHitboxes[2].recalcEdges();
  activeHitboxes.push(new hitBox(createVector(0, 0), 0, 0));
  activeHitboxes[3].points = [createVector(floor(gridW / 100 / 2) * 100 + 185 + imgScale * 128 * hitBoxHeight / 2, -200), createVector(gridW, -200), createVector(gridW, -100), createVector(floor(gridW / 100 / 2) * 100 + 105 - imgScale * 128 * hitBoxHeight / 2, -100)];
  activeHitboxes[3].recalcEdges();
  activeHitboxes.push(new hitBox(createVector(0, 0), 0, 0));
  activeHitboxes[4].points = [createVector(0, -500), createVector(floor(gridW / 100 / 2) * 100 - 80 - imgScale * 128 * hitBoxHeight / 2, -500), createVector(floor(gridW / 100 / 2) * 100 - 80 - imgScale * 128 * hitBoxHeight / 2, -200), createVector(0, -200)];
  activeHitboxes[4].recalcEdges();
  activeHitboxes.push(new hitBox(createVector(0, 0), 0, 0));
  activeHitboxes[5].points = [createVector(floor(gridW / 100 / 2) * 100 + 185 + imgScale * 128 * hitBoxHeight / 2, -500), createVector(gridW, -500), createVector(gridW, -200), createVector(floor(gridW / 100 / 2) * 100 + 185 + imgScale * 128 * hitBoxHeight / 2, -200)];
  activeHitboxes[5].recalcEdges();
  activeHitboxes.push(new hitBox(createVector(0, 0), 0, 0));
  activeHitboxes[6].points = [createVector(0, -600), createVector(gridW, -600), createVector(gridW, -400), createVector(0, -400)];
  activeHitboxes[6].recalcEdges();
}

function draw() {
  background(51);
  console.log("MouseY :" + mouseY + "; scroll : " + scroll);

  if (grabbing) {
    scroll = lerp(scroll, -mouseY / height * (gridH + 350), 0.1);
  }

  offsetX = width / 2 - gridW / 2;
  offsetY = 450 + scroll;
  activateHitboxes();

  if (!gameOver && grabbing) {
    if (keyIsDown(81) || keyIsDown(37)) {
      rotation -= 0.1;
    }

    if (keyIsDown(69) || keyIsDown(39)) {
      rotation += 0.1;
    }
  }

  for (var i = 0; i < hitboxes.length; i++) {}

  if (grabbing) {
    batteryHitBox.point = createVector(mouseX - offsetX, mouseY - offsetY);
  }

  batteryHitBox.rot = rotation;
  batteryHitBox.updateValues(1);
  push();
  translate(offsetX, offsetY);
  noStroke();
  fill(0, 36, 0, 43 / 100 * 255);
  rect(0, 4, gridW, gridH);
  image(stomachImg, gridW / 2 - imgScale * 440, -imgScale * 975);
  batteryHitBox.show(1);
  stroke(255);

  for (var i = 0; i < grid.length; i++) {
    grid[i].show();
  }

  if (!dropBattery && !noclip) {
    for (var i = 0; i < activeHitboxes.length; i++) {
      checkCollision(batteryHitBox, activeHitboxes[i]);

      if (showHitboxes) {
        activeHitboxes[i].show(0);
      }
    }
  }

  helpBtn.checkHovering(createVector(mouseX - offsetX, mouseY - offsetY));
  helpBtn.show();
  pop();
  imageMode(CENTER);

  if (gameOver) {
    fill(0, 155 * backgroundFade);
    rect(0, 0, width, height);
    push();
    translate(width / 2, height / 2);
    scale(bubbleGrowth);
    image(gameOverImg, 0, 0);
    pop();
  }

  if (win) {
    noStroke();
    fill(0, 155 * winFade);
    rect(0, 0, width, height);
    push();
    translate(width / 2, height / 2);
    tint(255, 255 * winFade);
    image(winningImg, 0, 0);
    fill(255);
    textSize(14);
    text("m", -115, 140);
    text("s", 0, 140);
    text("cs", 115, 140);
    textSize(60);
    var minutes = Math.floor(time / 1000 / 60);
    var seconds = Math.floor((time - minutes * 1000 * 60) / 1000);
    var milliseconds = Math.round((time - minutes * 1000 * 60 - seconds * 1000) / 10);
    text((minutes > 9 ? minutes : "0" + minutes) + " : " + (seconds > 9 ? seconds : "0" + seconds) + " : " + (milliseconds > 9 ? milliseconds : "0" + milliseconds), 0, 100);
    pop();
  }

  imageMode(CORNER);

  if (growBubble) {
    if (frameCount < startFrame + bubbleGrowDuration) {
      bubbleGrowth = Berp(0, 1, (frameCount - startFrame) / bubbleGrowDuration, 3.5, 2.2, 1.2);
      backgroundFade = easeInOutQuad(0, 1, (frameCount - startFrame) / bubbleGrowDuration);
    } else {
      growBubble = false;
    }
  }

  if (dropBattery) {
    if (frameCount < battStartFrame + battDropDuration) {
      battDrop = Berp(0, 1, (frameCount - battStartFrame) / battDropDuration, 5, 7, 1.2);
      batteryHitBox.point.y = -400 + 200 * battDrop;
      scroll = -70 * customLerp(-1, 1, battDrop) / height * (gridH + 350);
      rotation = Berp(startRotation, 0, (frameCount - battStartFrame) / battDropDuration, 3.5, 2.2, 1.2);
    } else {
      dropBattery = false;
    }
  }

  if (showHelp) {
    if (frameCount < helpStartFrame + helpFadeDuration) {
      helpFade = easeInOutQuad(0, 1, (frameCount - helpStartFrame) / helpFadeDuration);
      helpBtn.fade = helpFade;
    } else {
      showHelp = false;
    }
  }

  if (hideHelp) {
    if (frameCount < helpStartFrame + helpFadeDuration) {
      helpFade = easeInOutQuad(1, 0, (frameCount - helpStartFrame) / helpFadeDuration);
      helpBtn.fade = helpFade;
    } else {
      hideHelp = false;
      helpBtn.clicked = false;
    }
  }

  if (showWin) {
    if (frameCount < winStartFrame + winFadeDuration) {
      winFade = easeInOutQuad(0, 1, (frameCount - winStartFrame) / winFadeDuration);
    } else {
      showWin = false;
    }
  }

  if (hideWin) {
    if (frameCount < winStartFrame + winFadeDuration) {
      winFade = easeInOutQuad(1, 0, (frameCount - winStartFrame) / winFadeDuration);
      scroll = customLerp(scroll, -70 / height * (gridH + 350), winFade);
    } else {
      hideWin = false;
      win = false;
    }
  }

  if (starting) {
    if (millis() > 1500) {
      starting = false;
      helpStartFrame = frameCount;
      helpBtn.clicked = true;
      showHelp = true;
    }
  }

  if (batteryHitBox.point.y > gridH + cellSize && !win) {
    win = true;
    showWin = true;
    winStartFrame = frameCount;
    winFade = 0;
    grabbing = false;
    time = millis() - startRound;
    startTimer = true;
  }
}

function mouseClicked() {
  if (helpBtn.hovering) {
    helpBtn.fade = 0;
    helpStartFrame = frameCount;
    helpBtn.clicked = true;
    showHelp = true;
  } else {
    helpStartFrame = frameCount;
    hideHelp = true;
  }
}

function mousePressed() {
  if (!gameOver && !dropBattery && !starting && !showHelp && !win) {
    if (createVector(mouseX, mouseY).dist(createVector(batteryHitBox.point.x + offsetX, batteryHitBox.point.y + offsetY)) < 20) {
      grabbing = true;

      if (startTimer) {
        startTimer = false;
        startRound = millis();
      }
    }
  } else if (!dropBattery && !starting && !showHelp) {
    if (gameOver) {
      gameOver = false;
      startTimer = true;
    }

    if (win) {
      winStartFrame = frameCount;
      winFade = 1;
      hideWin = true;
    }

    dropBattery = true;
    battStartFrame = frameCount;
    battDrop = 0;
    batteryHitBox = new hitBox(createVector(gridW / cellSize / 2 * 100, -400), imgScale * 0.7 * 70, imgScale * 0.7 * 169);
    startRotation = Math.floor(Math.random() * (Math.PI / 2)) - Math.PI / 4;
    rotation = startRotation;
    scroll = -70 / height * (gridH + 350);
    genMaze(cellSize);
  }
}

function mouseReleased() {
  grabbing = false;
}

function GameOver() {
  if (gameOver == false) {
    grabbing = false;
    gameOver = true;
    startFrame = frameCount;
    bubbleGrowth = 0;
    backgroundFade = 0;
    growBubble = true;
  }
}

function activateHitboxes() {
  var update = false;
  var i = floor((mouseX - offsetX) / cellSize);
  var j = Math.max(0, floor((mouseY - offsetY) / cellSize));
  curr = [i, j];

  if (curr != prev) {
    update = true;
  }

  prev = curr;

  if (update) {
    for (var _k = activeHitboxes.length; _k > 7; _k--) {
      activeHitboxes.pop();
    }

    var current = grid[index(i, j)];
    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];
    var topR = grid[index(i + 1, j - 1)];
    var topL = grid[index(i - 1, j - 1)];
    var bottomR = grid[index(i + 1, j + 1)];
    var bottomL = grid[index(i - 1, j + 1)];

    for (var k = 0; k < grid.length; k++) {
      grid[k].activeHitbox = false;
    }

    if (current) {
      current.activeHitbox = true;

      for (var _k2 = 0; _k2 < 4; _k2++) {
        if (current.walls[_k2] && _k2 < 2) {
          activeHitboxes.push(current.hitboxes[_k2]);
        } else {
          if (current.showBottom && _k2 == 2) {
            activeHitboxes.push(current.hitboxes[_k2]);
          }

          if (current.showLeft && _k2 == 3) {
            activeHitboxes.push(current.hitboxes[_k2]);
          }
        }
      }
    }

    if (top) {
      top.activeHitbox = true;

      for (var _k3 = 0; _k3 < 4; _k3++) {
        if (top.walls[_k3] && _k3 < 2) {
          activeHitboxes.push(top.hitboxes[_k3]);
        } else {
          if (top.showBottom && _k3 == 2) {
            activeHitboxes.push(top.hitboxes[_k3]);
          }

          if (top.showLeft && _k3 == 3) {
            activeHitboxes.push(top.hitboxes[_k3]);
          }
        }
      }
    }

    if (right) {
      right.activeHitbox = true;

      for (var _k4 = 0; _k4 < 4; _k4++) {
        if (right.walls[_k4] && _k4 < 2) {
          activeHitboxes.push(right.hitboxes[_k4]);
        } else {
          if (right.showBottom && _k4 == 2) {
            activeHitboxes.push(right.hitboxes[_k4]);
          }

          if (right.showLeft && _k4 == 3) {
            activeHitboxes.push(right.hitboxes[_k4]);
          }
        }
      }
    }

    if (bottom) {
      bottom.activeHitbox = true;

      for (var _k5 = 0; _k5 < 4; _k5++) {
        if (bottom.walls[_k5] && _k5 < 2) {
          activeHitboxes.push(bottom.hitboxes[_k5]);
        } else {
          if (bottom.showBottom && _k5 == 2) {
            activeHitboxes.push(bottom.hitboxes[_k5]);
          }

          if (bottom.showLeft && _k5 == 3) {
            activeHitboxes.push(bottom.hitboxes[_k5]);
          }
        }
      }
    }

    if (left) {
      left.activeHitbox = true;

      for (var _k6 = 0; _k6 < 4; _k6++) {
        if (left.walls[_k6] && _k6 < 2) {
          activeHitboxes.push(left.hitboxes[_k6]);
        } else {
          if (left.showBottom && _k6 == 2) {
            activeHitboxes.push(left.hitboxes[_k6]);
          }

          if (left.showLeft && _k6 == 3) {
            activeHitboxes.push(left.hitboxes[_k6]);
          }
        }
      }
    }

    if (topR) {
      topR.activeHitbox = true;

      for (var _k7 = 0; _k7 < 4; _k7++) {
        if (topR.walls[_k7] && _k7 < 2) {
          activeHitboxes.push(topR.hitboxes[_k7]);
        } else {
          if (topR.showBottom && _k7 == 2) {
            activeHitboxes.push(topR.hitboxes[_k7]);
          }

          if (topR.showLeft && _k7 == 3) {
            activeHitboxes.push(topR.hitboxes[_k7]);
          }
        }
      }
    }

    if (topL) {
      topL.activeHitbox = true;

      for (var _k8 = 0; _k8 < 4; _k8++) {
        if (topL.walls[_k8] && _k8 < 2) {
          activeHitboxes.push(topL.hitboxes[_k8]);
        } else {
          if (topL.showBottom && _k8 == 2) {
            activeHitboxes.push(topL.hitboxes[_k8]);
          }

          if (topL.showLeft && _k8 == 3) {
            activeHitboxes.push(topL.hitboxes[_k8]);
          }
        }
      }
    }

    if (bottomR) {
      bottomR.activeHitbox = true;

      for (var _k9 = 0; _k9 < 4; _k9++) {
        if (bottomR.walls[_k9] && _k9 < 2) {
          activeHitboxes.push(bottomR.hitboxes[_k9]);
        } else {
          if (bottomR.showBottom && _k9 == 2) {
            activeHitboxes.push(bottomR.hitboxes[_k9]);
          }

          if (bottomR.showLeft && _k9 == 3) {
            activeHitboxes.push(bottomR.hitboxes[_k9]);
          }
        }
      }
    }

    if (bottomL) {
      bottomL.activeHitbox = true;

      for (var _k10 = 0; _k10 < 4; _k10++) {
        if (bottomL.walls[_k10] && _k10 < 2) {
          activeHitboxes.push(bottomL.hitboxes[_k10]);
        } else {
          if (bottomL.showBottom && _k10 == 2) {
            activeHitboxes.push(bottomL.hitboxes[_k10]);
          }

          if (bottomL.showLeft && _k10 == 3) {
            activeHitboxes.push(bottomL.hitboxes[_k10]);
          }
        }
      }
    }

    update = false;
  }
}

function genMaze(s) {
  cols = floor(gridW / s);
  rows = floor(gridH / s);
  w = s;
  grid = [];
  var finished = false;

  for (var j = 0; j < rows; j++) {
    for (var i = 0; i < cols; i++) {
      var cell = new Cell(i, j);
      grid.push(cell);
    }
  }

  current = grid[cols * rows - floor(cols / 2) - 1];

  while (!finished) {
    current.visited = true;
    var next = current.checkNeighbors();

    if (next) {
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length > 0) {
      current = stack.pop();
    } else {
      finished = true;
    }
  }

  for (var i = 0; i < cols; i++) {
    grid[cols * rows - cols + i].showBottom = true;
  }

  for (var i = 0; i < rows; i++) {
    grid[i * cols].showLeft = true;
  }

  grid[floor(cols / 2)].walls[0] = false;
  grid[cols * rows - floor(cols / 2) - 1].walls[2] = false;
  grid[cols * rows - floor(cols / 2) - 1].showBottom = false;
}

function index(i, j) {
  if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
    return -1;
  }

  return i + j * cols;
}

var Cell = function Cell(i, j) {
  _classCallCheck(this, Cell);

  this.i = i;
  this.j = j;
  this.walls = [true, true, true, true];
  this.visited = false;
  this.showBottom = false;
  this.showLeft = false;
  this.activeHitbox = false;
  var hitBoxX = imgScale * 256;
  var hitBoxY = imgScale * 128;
  this.hitboxes = [new hitBox(createVector(i * w, j * w - imgScale * 128 / 2).add(createVector((hitBoxX - hitBoxX * hitBoxWidth) / 2, (hitBoxY - hitBoxY * hitBoxHeight) / 2)), hitBoxX * hitBoxWidth, hitBoxY * hitBoxHeight), new hitBox(createVector(i * w + w * 3 / 4, j * w).add(createVector((hitBoxY - hitBoxY * hitBoxHeight) / 2, (hitBoxX - hitBoxX * hitBoxWidth) / 2)), hitBoxY * hitBoxHeight, hitBoxX * hitBoxWidth), new hitBox(createVector(i * w, j * w + w - w / 4).add(createVector((hitBoxX - hitBoxX * hitBoxWidth) / 2, (hitBoxY - hitBoxY * hitBoxHeight) / 2)), hitBoxX * hitBoxWidth, hitBoxY * hitBoxHeight), new hitBox(createVector(i * w - w / 4, j * w).add(createVector((hitBoxY - hitBoxY * hitBoxHeight) / 2, (hitBoxX - hitBoxX * hitBoxWidth) / 2)), hitBoxY * hitBoxHeight, hitBoxX * hitBoxWidth)];

  this.checkNeighbors = function () {
    var neighbors = [];
    var top = grid[index(i, j - 1)];
    var right = grid[index(i + 1, j)];
    var bottom = grid[index(i, j + 1)];
    var left = grid[index(i - 1, j)];

    if (top && !top.visited) {
      neighbors.push(top);
    }

    if (right && !right.visited) {
      neighbors.push(right);
    }

    if (bottom && !bottom.visited) {
      neighbors.push(bottom);
    }

    if (left && !left.visited) {
      neighbors.push(left);
    }

    if (neighbors.length > 0) {
      var r = floor(random(0, neighbors.length));
      return neighbors[r];
    } else {
      return undefined;
    }
  };

  this.show = function () {
    var x = this.i * w;
    var y = this.j * w;
    stroke(255, 255, 0);

    if (this.walls[0]) {
      image(wallImg, x, y - imgScale * 128 / 2);
    }

    if (this.walls[1]) {
      push();
      translate(x + w + w / 3, y);
      rotate(PI / 2);
      image(wallImg, 0, 0);
      pop();
    }

    if (this.walls[2] && this.showBottom) {
      image(wallImg, x, y + w - w / 4);
    }

    if (this.walls[3] && this.showLeft) {
      push();
      translate(x + w / 3, y);
      rotate(PI / 2);
      image(wallImg, 0, 0);
      pop();
    }
  };
};

var hitBox = function hitBox(point, x, y) {
  _classCallCheck(this, hitBox);

  this.point = point;
  this.points = [this.point, createVector(this.point.x + x, this.point.y), createVector(this.point.x + x, this.point.y + y), createVector(this.point.x, this.point.y + y)];
  this.edges = [p5.Vector.sub(this.points[0], this.points[1]), p5.Vector.sub(this.points[1], this.points[2]), p5.Vector.sub(this.points[2], this.points[3]), p5.Vector.sub(this.points[3], this.points[0])];
  this.rot = 0;
  this.intersect = false;

  this.updateValues = function (type) {
    if (type == 0) {
      this.points = [this.point, createVector(this.point.x + x, this.point.y), createVector(this.point.x + x, this.point.y + y), createVector(this.point.x, this.point.y + y)];
      this.edges = [p5.Vector.sub(this.points[0], this.points[1]), p5.Vector.sub(this.points[1], this.points[2]), p5.Vector.sub(this.points[2], this.points[3]), p5.Vector.sub(this.points[3], this.points[0])];
    } else if (type === 1) {
      for (var i = 0; i < 4; i++) {
        this.points[i] = createVector(this.point.x + batteryRad * Math.cos(this.rot + angles[i]), this.point.y + batteryRad * Math.sin(this.rot + angles[i]));
        this.edges = [p5.Vector.sub(this.points[0], this.points[1]), p5.Vector.sub(this.points[1], this.points[2]), p5.Vector.sub(this.points[2], this.points[3]), p5.Vector.sub(this.points[3], this.points[0])];
      }
    }
  };

  this.recalcEdges = function () {
    this.edges = [p5.Vector.sub(this.points[0], this.points[1]), p5.Vector.sub(this.points[1], this.points[2]), p5.Vector.sub(this.points[2], this.points[3]), p5.Vector.sub(this.points[3], this.points[0])];
  };

  this.show = function (type) {
    if (type === 1) {
      push();
      translate(this.point.x, this.point.y);
      rotate(rotation);
      image(batteryImg, -batteryImgW / 2, -batteryImgH / 2);
      pop();
    }

    if (this.intersect) {
      stroke(255, 0, 0);
    }

    if (showHitboxes) {
      textSize(16);
      text("(" + point.x + ":" + point.y + ")", point.x + 10, point.y + 10);
      line(this.points[0].x, this.points[0].y, this.points[1].x, this.points[1].y);
      line(this.points[1].x, this.points[1].y, this.points[2].x, this.points[2].y);
      line(this.points[2].x, this.points[2].y, this.points[3].x, this.points[3].y);
      line(this.points[3].x, this.points[3].y, this.points[0].x, this.points[0].y);
    }
  };
};

function removeWalls(a, b) {
  var x = a.i - b.i;

  switch (x) {
    case 1:
      a.walls[3] = false;
      b.walls[1] = false;
      break;

    case -1:
      a.walls[1] = false;
      b.walls[3] = false;
      break;
  }

  var y = a.j - b.j;

  switch (y) {
    case 1:
      a.walls[0] = false;
      b.walls[2] = false;
      break;

    case -1:
      a.walls[2] = false;
      b.walls[0] = false;
      break;
  }
}

function projectPolygon(axis, points, min, max) {
  var dotProduct = axis.dot(points[0]);
  min = dotProduct;
  max = dotProduct;

  for (var i = 0; i < points.length; i++) {
    dotProduct = points[i].dot(axis);

    if (dotProduct < min) {
      min = dotProduct;
    } else if (dotProduct > max) {
      max = dotProduct;
    }
  }

  return [min, max];
}

function intervalDistance(minA, maxA, minB, maxB) {
  if (minA < minB) {
    return minB - maxA;
  } else {
    return minA - maxB;
  }
}

function checkCollision(boxA, boxB) {
  boxA.intersect = true;
  boxB.intersect = true;
  var minIntervalDistance = 5000;
  var translationAxis;
  var edge;

  for (var i = 0; i < 8; i++) {
    if (i < 4) {
      edge = boxA.edges[i];
    } else {
      edge = boxB.edges[i - 4];
    }

    var axis = createVector(-edge.y, edge.x);
    axis.normalize();
    var minA = 0;
    minB = 0;
    maxA = 0;
    maxB = 0;
    var projectionA = projectPolygon(axis, boxA.points, minA, maxB);
    var projectionB = projectPolygon(axis, boxB.points, minB, maxB);

    if (intervalDistance(projectionA[0], projectionA[1], projectionB[0], projectionB[1]) > 0) {
      boxA.intersect = false;
      boxB.intersect = false;
    }

    if (!boxA.intersect) break;
  }

  if (boxA.intersect) {
    GameOver();
  }
}

var Button = function Button(pos, img, hoverImg, imgW, imgH) {
  _classCallCheck(this, Button);

  this.pos = pos;
  this.img = img;
  this.hoverImg = hoverImg;
  this.imgW = imgW;
  this.imgH = imgH;
  this.hovering = false;
  this.clicked = false;
  this.fade = 0;

  this.checkHovering = function (point) {
    if (point.x > this.pos.x && point.x < this.pos.x + imgW && !this.clicked) {
      if (point.y > this.pos.y && point.y < this.pos.y + imgH) {
        this.hovering = true;
      } else {
        this.hovering = false;
      }
    } else {
      this.hovering = false;
    }
  };

  this.show = function () {
    if (this.hovering && !this.clicked) {
      image(this.hoverImg, this.pos.x, this.pos.y);
    } else {
      image(this.img, this.pos.x, this.pos.y);
    }

    if (this.clicked) {
      push();
      translate(-offsetX, -offsetY);
      noStroke();
      fill(0, this.fade * 155);
      rect(0, 0, width, height);
      tint(255, this.fade * 255);
      imageMode(CENTER);
      image(helpImg, width / 2, height / 2);
      imageMode(CORNER);
      pop();
    }
  };
};

function Berp(start, end, value, spring1, spring2, spring3) {
  value = Math.max(0, Math.min(value, 1));
  value = (Math.sin(value * Math.PI * (spring1 * value * value * value)) * Math.pow(1 - value, spring2) + value) * (1 + spring3 * (1 - value));
  return start + (end - start) * value;
}

function easeInOutQuad(start, end, value) {
  return customLerp(start, end, value * value * (3 - 2 * value));
}

function customLerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}