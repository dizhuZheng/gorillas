// The state of the game, metadata
let state = {};

// References to HTML elements
const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

newGame();

function newGame() {
  // Initialize game state and reset it
  state = {
    phase: "aiming",
    scale: 1,
    currentPlayer: 1,
    bomb: {
      x: undefined,
      y: undefined,
      velocity: {x:0, y:0}
    },
    buildings: generateBuildings(),
    bb: generateBackBuildings()
  };
  // initializeBombPosition();
  calculateScale();
  draw();
}

function draw() {
  ctx.save(); 
  // Flip coordinate system upside down 
  ctx.translate(0, window.innerHeight); 
  ctx.scale(1, -1); 
  ctx.scale(state.scale, state.scale);
  // // Draw scene 
  drawBackground(); 
  drawBackBuildings();
  drawBuildings();
  // drawGorilla(1);
  // drawGorilla(2);
  // drawBomb(); 
  // Restore transformation 
  ctx.restore(); 
}

// Event handlers
// ...
// The mouseup event will trigger the throwBomb function that kicks off the main animation loop. 

function throwBomb() {

}

function animate(timestamp) {
  // The animate function will manipulate the state in every animation cycle and call the draw function to update the screen.
}

function initializeBombPosition()
{
  ctx.fillStyle = "#58A8D8";
  ctx.fillRect(0,0,canvas.width, canvas.height);
  ctx.strokeStyle = "#ffffb3";
}

function drawBuildings()
{
 state.buildings.forEach((building) => {
  ctx.fillStyle = "#152A47";
  ctx.fillRect(building.x, 0, building.width, building.height);
 });
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
  ctx.moveTo(state.bb[3].x,state.bb[3].height);
  ctx.lineTo(state.bb[3].x+60,state.bb[3].height+60);
  ctx.lineTo(state.bb[3].x+state.bb[3].width,state.bb[3].height);
  ctx.lineTo(state.bb[3].x,state.bb[3].height);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(state.bb[5].x,state.bb[5].height);
  ctx.lineTo(state.bb[5].x+50,state.bb[5].height+50);
  ctx.lineTo(state.bb[5].x+state.bb[5].width,state.bb[5].height);
  ctx.lineTo(state.bb[5].x,state.bb[5].height);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(state.bb[7].x,state.bb[7].height);
  ctx.lineTo(state.bb[7].x+70,state.bb[7].height+70);
  ctx.lineTo(state.bb[7].x+state.bb[7].width,state.bb[7].height);
  ctx.lineTo(state.bb[7].x,state.bb[7].height);
  ctx.fill();
  ctx.restore();
}

function randomColor(){ 
  return('#'+Math.floor(Math.random()*16777215).toString(16));
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
  for (let index = 0; index < 8; index++) {
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
  ctx.fillRect(0,0,canvas.width, canvas.height);
  // drawMoon();
  // drawStar(600, 600, 5, 10, 15);
  // drawStar(200, 800, 5, 10, 15);
  // drawStar(800, 500, 5, 10, 15);
}

function drawGorilla(player)
{
  ctx.save();
  const building =
    player === 1
      ? state.buildings.at(1) // Second building
      : state.buildings.at(-2); // Second last building

  ctx.translate(building.x + building.width / 2, building.height);

  drawGorillaBody();
  drawGorillaLeftArm(player);
  drawGorillaRightArm(player);
  drawGorillaFace();

  ctx.restore();
}

function drawBomb()
{
  ctx.beginPath();
  ctx.moveTo(state.bomb.x, state.bomb.y);
  ctx.quadraticCurveTo(state.bomb.x * 2, state.bomb.y * 2, 230, 20);
  ctx.stroke();
}

function drawMoon()
{
  ctx.arc(canvas.width-200, canvas.height-200, 50, 0, 2 * Math.PI);
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

function initializeBombPosition() {
  const gorillaX = building.x + building.width / 2;
  const gorillaY = building.height;
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

function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
  var rot = Math.PI / 2 * 3;
  var x = cx;
  var y = cy;
  var step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius)

  for (i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y)
      rot += step

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y)
      rot += step
  }
  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath();
  ctx.fillStyle='white';
  ctx.fill();

}