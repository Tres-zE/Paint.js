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
const $canvas = "#canvas"; //DOM element for canvas
const ctx = $canvas.getContext("2d"); //canvas context

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

//methods
function startDrawing(e) {
  isDrawing = true;

  const { offsetX, offsetY } = e;

  //guardar coordenadas iniciales 'Destructuracion'
  [startX, startY] = [offsetX, offsetY];
  [lastX, lastY] = [offsetX, offsetY];
}

function draw(e) {}

function stopDrawing(e) {}
