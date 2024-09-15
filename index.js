// The state of the game, metadata
let state = {};
// ...

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
    currentPlayer: 1,
    bomb: {
      x: undefined,
      y: undefined,
      velocity: {x:0, y:0}
    },
    buildings: generateBuildings(),
  };

  initializeBombPosition();

  draw();
}

function draw() {
  ctx.save(); 
  // Flip coordinate system upside down 
  ctx.translate(0, window.innerHeight); 
  ctx.scale(1, -1); 

  // // Draw scene 
  drawBackground(); 
  //drawWindmill();
  drawBuildings();
  // drawBackBuilding();
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
  // ...
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
  // for(let index=0; index<Math.random()*5; index++)
  // {
  //   ctx.fillRect(building.x+Math.random() * (100 - 50), building.height-Math.random() * (250-80), 20, 20);
  // }
  // });
}

function generateBuildings() {
  const buildings = [];
  const minWidth = 80;
  const maxWidth = 130;
  const minHeight = 40;
  const maxHeight = 300;
  const minHeightGorilla = 30;
  const maxHeightGorilla = 150;
  const width = minWidth + Math.random() * (maxWidth - minWidth);

  for (let index = 0; index < 10; index++) {
    const previousBuilding = buildings[index - 1];

    const x = previousBuilding
      ? previousBuilding.x + previousBuilding.width + 4
      : 0;

    const platformWithGorilla = index === 1 || index === 6;

    const height = platformWithGorilla
      ? minHeightGorilla + Math.random() * (maxHeightGorilla - minHeightGorilla)
      : minHeight + Math.random() * (maxHeight - minHeight);

    buildings.push({ x, width, height });
  }
  return buildings;
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
  drawGorillaBody();
}

function drawBomb()
{
  ctx.arc(canvas.width-Math.random() * 80, canvas.height-Math.random() * 80, 50, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fillStyle="yellow";
  ctx.fill();
}

function drawMoon()
{
  ctx.arc(canvas.width-200, canvas.height-200, 50, 0, 2 * Math.PI);
  ctx.fillStyle="yellow";
  ctx.fill();
}

function drawWindmill()
{
  // ctx.opacity = "0.3";
  ctx.strokeStyle = "white";
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(50, 0);
  ctx.lineTo(50, 150);
  ctx.stroke();
}

function drawGorillaBody()
{
  ctx.fillStyle = "black";

  ctx.beginPath();

  ctx.moveTo(0, 15);

  ctx.lineTo(-7, 0);
  ctx.lineTo(-20, 0);
  // Main Body
  ctx.lineTo(-13, 77);
  ctx.lineTo(0, 84);
  ctx.lineTo(13, 77); 

  // Right Leg
  ctx.lineTo(20, 0);
  ctx.lineTo(7, 0);

  ctx.fill();
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

function drawGorillaArms()
{
  
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