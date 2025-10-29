//constants
const MODES = {
  DRAW: "draw",
  ERASE: "erase",
  RECTANGLE: "rectangle",
  ELLIPSE: "ellipse",
  PICKER: "picker",
};
//utilities
const $ = (el) => document.querySelector(el);
const $$ = (els) => document.querySelectorAll(els);

//elements
const $canvas = $("#canvas"); //DOM element for canvas
const ctx = $canvas.getContext("2d"); //canvas context
const $colorPicker = $("#colorPicker"); //DOM element for color picker
const $clearBtn = $("#clear-btn"); //DOM element for clear button

//state
let isDrawing = false; //flag to track drawing state
let startX, startY;
let lastX = 0; //last x position
let lastY = 0; //last y position
let mode = MODES.DRAW; //current mode

//event listeners
$canvas.addEventListener("mousedown", startDrawing);
$canvas.addEventListener("mousemove", draw);
$canvas.addEventListener("mouseup", stopDrawing);
$canvas.addEventListener("mouseleave", stopDrawing);

$colorPicker.addEventListener("change", handleChangeColor);
$clearBtn.addEventListener("click", clearCanvas);
//methods
function startDrawing(e) {
  isDrawing = true;

  const { offsetX, offsetY } = e;

  //guardar coordenadas iniciales 'Destructuracion'
  [startX, startY] = [offsetX, offsetY];
  [lastX, lastY] = [offsetX, offsetY];
}

function draw(e) {
  if (!isDrawing) return;

  const { offsetX, offsetY } = e;

  //comenzar el dibujo
  ctx.beginPath();

  //mover  el trazado a la posicion inicial
  ctx.moveTo(lastX, lastY);

  //dibujar una linea entre coordenadas actuales y ultimas
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();

  ctx.lineWidth = 2;

  //actualizar ultimas coordenadas
  [lastX, lastY] = [offsetX, offsetY];
}

function stopDrawing(e) {
  isDrawing = false;
}

function handleChangeColor() {
  const { value } = $colorPicker;
  ctx.strokeStyle = value;
  ctx.fillStyle = value;
}

function clearCanvas() {
  ctx.clearRect(0, 0, $canvas.width, $canvas.height);
}
