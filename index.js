// The state of the game, metadata
let state = {};

// References to HTML elements
const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const v1 = document.querySelector("#info-left .velocity");
// const v2 = document.querySelector("#info-right .velocity");
const a1 = document.querySelector("#info-left .angle");
// const a2 = document.querySelector("#info-right .angle");
const bombGrab = document.querySelector("#bomb-grab-area");
const grabAreaRadius = 15;
const b = document.querySelector("body");

newGame();

function newGame() {
  // Initialize game state and reset it
  state = {
    phase: "aiming",
    scale: 1,
    currentPlayer: 1,
    flag: false,
    bomb: {
      x: undefined,
      y: undefined,
      velocity: {x:0, y:0}
    },
    buildings: generateBuildings(),
    //bb: generateBackBuildings(),
  };
  calculateScale();
  initializeBombPosition();
  draw();
}
// window.addEventListener("mousedown", function(event) {
  
// });

function mouseOver() {
  alert('hahaha');
}

// document.getElementById("demo").onmouseout = function() {mouseOut()};

bombGrab.addEventListener("mousedown", (e) => {
  // state.flag = true;
  b.style.cursor = "grab";
  window.addEventListener("mouseup", (e) => {
    // state.flag = true;
    b.style.cursor = "default";
  });
});

function draw() {
  ctx.save(); 
  // Flip coordinate system upside down 
  ctx.translate(0, window.innerHeight); 
  ctx.scale(1, -1); 
  ctx.scale(state.scale, state.scale);
  // // Draw scene 
  drawBackground(); 
  //drawMoon();
  // drawBackBuildings();
  //drawBuildings();
 // drawWindows();
  drawGorilla(1);
  //drawGorilla(2);
  drawBomb(); 
  ctx.restore(); 
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  calculateScale();
  initializeBombPosition();
  draw();
});


// function throwBomb() {

// }

// function animate(timestamp) {
//   // The animate function will manipulate the state in every animation cycle and call the draw function to update the screen.
// }

function drawLine(x, y) {
  ctx.save(); 
  ctx.translate(0, window.innerHeight); 
  ctx.scale(1, -1); 
  ctx.scale(state.scale, state.scale);
  ctx.beginPath();
  ctx.strokeStyle = "black";
  ctx.setLineDash([5, 15]);
  ctx.lineWidth = 1;
  ctx.moveTo(x, y);
  ctx.lineTo(x + 100, y + 100);
  ctx.stroke();
  ctx.restore();
}

function drawBuildings()
{
 state.buildings.forEach((building) => {
  ctx.fillStyle = "#152A47";
  ctx.fillRect(building.x, 0, building.width, building.height);
  drawWindows(building.x, building.height, building.width, building.height);
 });
}

function drawWindows(a, b, c, d)
{
  const e = a  * 1.1;
  const f = b * 0.7;
  const h = c * 0.09;
  const i = d * 0.09;
  ctx.fillStyle = "#e6b800";
  ctx.fillRect(e, f, h, i);
}

function drawBackBuildings()
{
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = "#152A47";
  state.bb.forEach((building) => {
    ctx.fillRect(building.x, 0, building.width, building.height);
  });
  ctx.beginPath();
  ctx.moveTo(state.bb[0].x,state.bb[0].height);
  ctx.lineTo(state.bb[0].x+60,state.bb[0].height+60);
  ctx.lineTo(state.bb[0].x+state.bb[0].width,state.bb[0].height);
  ctx.lineTo(state.bb[0].x,state.bb[0].height);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(state.bb[3].x,state.bb[3].height);
  ctx.lineTo(state.bb[3].x+50,state.bb[3].height+50);
  ctx.lineTo(state.bb[3].x+state.bb[3].width,state.bb[3].height);
  ctx.lineTo(state.bb[3].x,state.bb[3].height);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(state.bb[5].x,state.bb[5].height);
  ctx.lineTo(state.bb[5].x+70,state.bb[5].height+70);
  ctx.lineTo(state.bb[5].x+state.bb[5].width,state.bb[5].height);
  ctx.lineTo(state.bb[5].x,state.bb[5].height);
  ctx.fill();
  ctx.restore();
}

function generateBuildings() {
  const buildings = [];
  const minWidth = 80;
  const maxWidth = 150;
  const minHeight = 40;
  const maxHeight = 300;
  const minHeightGorilla = 30;
  const maxHeightGorilla = 150;

  for (let index = 0; index < 8; index++) {
    const previousBuilding = buildings[index - 1];

    const x = previousBuilding
      ? previousBuilding.x + previousBuilding.width + 4
      : 0;

    const platformWithGorilla = index === 1 || index === 6;

    const width = minWidth + Math.random() * (maxWidth - minWidth);

    const height = platformWithGorilla
      ? minHeightGorilla + Math.random() * (maxHeightGorilla - minHeightGorilla)
      : minHeight + Math.random() * (maxHeight - minHeight);

    buildings.push({ x, width, height });
  }
  return buildings;
}

function generateBackBuildings() {
  const bb = [];
  const minWidth = 80;
  const maxWidth = 150;
  const minHeight = 140;
  const maxHeight = 400;
  number = (window.innerWidth - 50 ) / maxWidth;
  for (let index = 0; index < number; index++) {
    const previousBuilding = bb[index - 1];

    const x = previousBuilding
      ? previousBuilding.x + previousBuilding.width + 4
      : 50;
    const width = minWidth + Math.random() * (maxWidth - minWidth);
    const height = minHeight + Math.random() * (maxHeight - minHeight);
    
    bb.push({ x, width, height });
  }
  return bb;
}

function drawBackground()
{
  ctx.fillStyle = "#58A8D8";
  ctx.fillRect(0, 0, window.innerWidth / state.scale,window.innerHeight / state.scale);
}

function drawGorilla(player)
{
  ctx.save();
  const building = player === 1
      ? state.buildings.at(1) 
      : state.buildings.at(-2);
  ctx.translate(building.x + building.width / 2, building.height);
  drawGorillaBody();
  drawGorillaLeftArm(player);
  drawGorillaRightArm(player);
  drawGorillaFace();
  ctx.restore();
}

function drawBomb()
{
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(state.bomb.x, state.bomb.y, 6, 0, 2 * Math.PI);
  ctx.fill();
}

function drawMoon()
{
  ctx.arc((3/4)*window.innerWidth/state.scale, (3/4)*window.innerHeight/state.scale, (1/20)*window.innerWidth/state.scale, 0, 2 * Math.PI);
  ctx.fillStyle="yellow";
  ctx.fill();
}

function drawGorillaBody()
{
  ctx.fillStyle = "black";

  ctx.beginPath();

  ctx.moveTo(0, 15);
  // Main Body
  ctx.lineTo(-7, 0);
  ctx.lineTo(-20, 0);

  // left leg
  ctx.lineTo(-13, 77);
  ctx.lineTo(0, 84);
  ctx.lineTo(13, 77); 

  // Right Leg
  ctx.lineTo(20, 0);
  ctx.lineTo(7, 0);

  ctx.fill();
}

function initializeBombPosition() 
{
  const building = state.currentPlayer === 1? state.buildings.at(1):state.buildings.at(-2); 
  const gorillaX = building.x + building.width / 2;
  const gorillaY = building.height;
  const gorillaHandOffsetX = state.currentPlayer === 1 ? -28 : 28;
  const gorillaHandOffsetY = 107;
  state.bomb.x = gorillaX + gorillaHandOffsetX;
  state.bomb.y = gorillaY + gorillaHandOffsetY;
  bombGrab.style.left = state.bomb.x * state.scale - grabAreaRadius + "px";
  bombGrab.style.bottom = state.bomb.y * state.scale - grabAreaRadius + "px";
  state.bomb.velocity.x = 0;
  state.bomb.velocity.y = 0;
}

function calculateScale()
{
  const lastBuilding = state.buildings.at(-1);
  const totalWidthOfTheCity = lastBuilding.x + lastBuilding.width;

  state.scale = window.innerWidth / totalWidthOfTheCity;
}

function drawGorillaFace()
{
  ctx.strokeStyle = "white";
  ctx.lineWidth = 3;

  ctx.beginPath();

  // Left Eye
  ctx.moveTo(-5, 70);
  ctx.lineTo(-2, 70);

  // Right Eye
  ctx.moveTo(2, 70);
  ctx.lineTo(5, 70);

  // Mouth
  ctx.moveTo(-5, 62);
  ctx.lineTo(5, 62);
  ctx.stroke();
}

function drawGorillaLeftArm(player)
{
  ctx.strokeStyle = "black";
  ctx.lineWidth = 18;

  ctx.beginPath();
  ctx.moveTo(-13, 50);

  if (
    (state.phase === "aiming" && state.currentPlayer === 1 && player === 1) ||
    (state.phase === "celebrating" && state.currentPlayer === player)
  ) {
    ctx.quadraticCurveTo(-44, 63, -28, 107);
  } else {
    ctx.quadraticCurveTo(-44, 45, -28, 12);
  }

  ctx.stroke();
}

function drawGorillaRightArm(player)
{
  ctx.strokeStyle = "black";
  ctx.lineWidth = 18;

  ctx.moveTo(13, 50);

  if (
    (state.phase === "aiming" && state.currentPlayer === 2 && player === 2) ||
    (state.phase === "celebrating" && state.currentPlayer === player)
  ) {
    ctx.quadraticCurveTo(44, 63, 28, 107);
  } else {
    ctx.quadraticCurveTo(44, 45, 28, 12);
  }
  ctx.stroke();
}

// function updateInfo(currentPlayer)
// {

// }