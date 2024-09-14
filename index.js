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
    buildings: generateBuildings()
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
  // /drawBuildings();
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
//  state.buildings.forEach((building) => {
//   ctx.fillStyle = "#152A47";
//   ctx.fillRect(building.x, 0, building.width, building.height);
//  });
}

function generateBuildings()
{
  // const buildings = [];
  // const gap = 4;
  // const minWidth = 80;
  // const maxWidth = 130;
  // const minHeight = 40;
  // const maxHeight = 300;
  // const minHeightGorilla = 30;
  // const maxHeightGorilla = 150;

  // for(let index=0; index < 10; index ++)
  // {
  //   const previousBuilding = buildings[index-1];
  //   const x = previousBuilding ? previousBuilding.x + previousBuilding.width + gap : 0;
  //   const width = minWidth + Math.random() * (maxWidth - minWidth);
  //   const height = platformWithGorilla
  //     ? minHeightGorilla + Math.random() * (maxHeightGorilla - minHeightGorilla)
  //     : minHeight + Math.random() * (maxHeight - minHeight);

  //   buildings.push({ x, width, height });
  // }
  // return buildings;
}

function drawBackground()
{
  ctx.fillStyle = "#58A8D8";
  ctx.fillRect(0,0,canvas.width, canvas.height);
}

function drawGorilla(player)
{

}

function drawBomb()
{

}

