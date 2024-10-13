// The state of the game, metadata
let state = {};

// References to HTML elements
const canvas = document.getElementById("game");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");
const v1 = document.querySelector("#info-left .velocity");
const v2 = document.querySelector("#info-right .velocity");
const a1 = document.querySelector("#info-left .angle");
const a2 = document.querySelector("#info-right .angle");
const center = document.querySelector("#info-center");
const bombGrab = document.querySelector("#bomb-grab-area");
const grabAreaRadius = 15;
const celebrate = document.querySelector("#celebrate");

newGame();

function newGame() {
  state = {
    phase: "aiming",
    scale: 1,
    currentPlayer: 1,
    flag: false, // isDragging
    dragX: undefined,
    dragY: undefined,
    hit: false,
    offScreen: false,
    hitGorilla: false,
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

function draw() {
  ctx.save(); 
  // Flip coordinate system upside down 
  ctx.translate(0, window.innerHeight); 
  ctx.scale(1, -1); 
  ctx.scale(state.scale, state.scale);
  // // Draw scene 
  drawBackground(); 
  drawBuildings();
  drawGorilla(1);
  drawGorilla(2);
  drawBomb(); 
  ctx.restore(); 
}

bombGrab.addEventListener("mousedown", (e) => {
  center.style.visibility = "hidden";
  if (state.phase === "aiming")
  {
    flag = true;
    dragX = e.clientX;
    dragY = e.clientY;
    document.body.style.cursor = "grab";
  }
});

window.addEventListener("mousemove", (e) => {
  if (flag == true)
  {
    let differenceX = e.clientX - dragX;
    let differenceY = e.clientY - dragY;
    state.bomb.velocity.x = -differenceX;
    state.bomb.velocity.y = -differenceY;
    // let difference = Math.sqrt(Math.pow(differenceX, 2)+Math.pow(differenceY, 2));
    // let k = differenceY / differenceX;
    // if(state.currentPlayer == 1)
    // {
    //   v1.innerHTML = Math.floor(difference);
    //   a1.innerHTML = -Math.round(Math.atan(k)/ Math.PI * 180);
    // }
    // else{
    //   v2.innerHTML = Math.floor(difference);
    //   a2.innerHTML = -Math.round(Math.atan(k)/ Math.PI * 180);
    // }
    draw();
  }
});

window.addEventListener("mouseup", (e) => {
  if (flag == true) {
    document.body.style.cursor = "default";
    // if ( state.currentPlayer == 1)
    // {
    //   v1.innerHTML = 0;
    //   a1.innerHTML = 0;
    // }
    // else{
    //   v2.innerHTML = 0;
    //   a2.innerHTML = 0;
    // }
    flag = false;
    throwBomb();
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  calculateScale();
  initializeBombPosition();
  draw();
});

function throwBomb() {
  state.phase = "flying";
  let start2 = Date.now(); 
  let timer = setInterval(function() {
    let timePassed = Date.now() - start2;
    hitBuildings();
    hitGorilla();
    checkoffScreen();
    art(timePassed);
    if(state.hit === true || state.offScreen === true || state.hitGorilla === true) { 
      state.offScreen = false;
      state.hit = false;
      state.hitGorilla = false;
      clearInterval(timer);
      return;
    }
  }, 20);
}

function quad(timeFraction) {
  return 1- 2 * Math.pow(timeFraction, 3);
}

function art(timePassed)
{
  state.bomb.x += state.bomb.velocity.x / 50 * timePassed / 100;
  state.bomb.y += quad(timePassed / 1000) - state.bomb.velocity.y / 50;
  draw();
}

function hitBuildings()
{
  state.buildings.forEach((building) => {
  if (
      state.bomb.x + 4 > building.x &&
      state.bomb.x - 4 < building.x + building.width &&
      state.bomb.y - 4 < 0 + building.height
    )
    {
      state.hit = true;
      updateInfo("Hit the Building");
      state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
      state.phase = "aiming";
      const enemyPlayer = state.currentPlayer === 1 ? 2 : 1;
      const enemyBuilding =
        enemyPlayer === 1
          ? state.buildings.at(1) // Second building
          : state.buildings.at(-2); // Second last building
      ctx.save();
      ctx.translate(
        enemyBuilding.x + enemyBuilding.width / 2,
        enemyBuilding.height
      );
      drawGorillaBody();
      drawGorillaLeftArm(enemyPlayer);
      drawGorillaRightArm(enemyPlayer);
          initializeBombPosition();
          drawBomb();
          ctx.restore();
    }
  });
}

function hitGorilla()
{
  const enemyPlayer = state.currentPlayer === 1 ? 2 : 1;
  const enemyBuilding =
    enemyPlayer === 1
      ? state.buildings.at(1) // Second building
      : state.buildings.at(-2); // Second last building
  ctx.save();
  ctx.translate(
    enemyBuilding.x + enemyBuilding.width / 2,
    enemyBuilding.height
  );
  drawGorillaBody();
  state.hitGorilla = ctx.isPointInPath(state.bomb.x, state.bomb.y);
  drawGorillaLeftArm(enemyPlayer);
  state.hitGorilla ||= ctx.isPointInStroke(state.bomb.x, state.bomb.y);
  drawGorillaRightArm(enemyPlayer);
  state.hitGorilla ||= ctx.isPointInStroke(state.bomb.x, state.bomb.y);
  if(state.hitGorilla === true) celebrate.style.visibility = "visible";
  ctx.restore();
}

function checkoffScreen()
{
 if(state.bomb.x > window.innerWidth/state.scale || state.bomb.x <=0 || state.bomb.y >= window.innerHeight/state.scale)
 {
  state.offScreen = true;
  updateInfo("Hit the Wall");
  state.currentPlayer = state.currentPlayer === 1 ? 2 : 1;
  state.phase = "aiming";
  const enemyPlayer = state.currentPlayer === 1 ? 2 : 1;
  const enemyBuilding =
    enemyPlayer === 1
      ? state.buildings.at(1) // Second building
      : state.buildings.at(-2); // Second last building
  ctx.save();
  ctx.translate(
    enemyBuilding.x + enemyBuilding.width / 2,
    enemyBuilding.height
  );
  drawGorillaBody();
  drawGorillaLeftArm(enemyPlayer);
  drawGorillaRightArm(enemyPlayer);
  initializeBombPosition();
  drawBomb();
  ctx.restore();
 }
}

function drawBuildings()
{
 state.buildings.forEach((building) => {
  ctx.fillStyle = "#152A47";
  ctx.fillRect(building.x, 0, building.width, building.height);
 });
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
  drawMoon();
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
  if (state.phase == "aiming")
  {
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.setLineDash([5, 10]);
    ctx.lineWidth = 1;
    ctx.moveTo(state.bomb.x, state.bomb.y);
    ctx.lineTo(state.bomb.x+state.bomb.velocity.x, state.bomb.y-state.bomb.velocity.y);
    ctx.stroke();
  }
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(state.bomb.x, state.bomb.y, 6, 0, 2 * Math.PI);
  ctx.fill();
}

function drawMoon()
{
  ctx.beginPath();
  ctx.arc((0.75)*window.innerWidth/state.scale, (0.75)*window.innerHeight/state.scale, (1/50)*window.innerWidth/state.scale, 0, 2 * Math.PI);
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
  const gorillaHandOffsetY = 113;
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

function updateInfo(str)
{
  center.style.visibility = "visible";
  center.innerHTML = str;
}