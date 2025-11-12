//constants
const MODES = {
  DRAW: 'draw',
  ERASE: 'erase',
  RECTANGLE: 'rectangle',
  ELLIPSE: 'ellipse',
  PICKER: 'picker',
};
//utilities
const $ = (el) => document.querySelector(el);
const $$ = (els) => document.querySelectorAll(els);

//elements
const $canvas = $('#canvas'); //DOM element for canvas
const ctx = $canvas.getContext('2d'); //canvas context
const $colorPicker = $('#colorPicker'); //DOM element for color picker
const $clearBtn = $('#clear-btn'); //DOM element for clear button
const $drawBtn = $('#draw-btn'); //DOM element for draw button
const $rectangleBtn = $('#rectangle-btn'); //DOM element for rectangle button
const $ereaseBtn = $('#erase-btn'); //DOM element for erase button
const $pickerBtn = $('#picker-btn'); //DOM element for color picker button

//state
let isDrawing = false; //flag to track drawing state
let startX, startY;
let lastX = 0; //last x position
let lastY = 0; //last y position
let mode = MODES.DRAW; //current mode
let imageData; //to store canvas image data
let isShiftPressed = false; //flag to track shift key state

//event listeners
$canvas.addEventListener('mousedown', startDrawing);
$canvas.addEventListener('mousemove', draw);
$canvas.addEventListener('mouseup', stopDrawing);
$canvas.addEventListener('mouseleave', stopDrawing);

$pickerBtn.addEventListener('click', () => setMode(MODES.PICKER));

$colorPicker.addEventListener('change', handleChangeColor);

$clearBtn.addEventListener('click', clearCanvas);

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

$ereaseBtn.addEventListener('click', () => {
  setMode(MODES.ERASE);
});

$drawBtn.addEventListener('click', () => setMode(MODES.DRAW));

$rectangleBtn.addEventListener('click', () => setMode(MODES.RECTANGLE));

//methods
function startDrawing(e) {
  isDrawing = true;

  const { offsetX, offsetY } = e;

  //guardar coordenadas iniciales 'Destructuracion'
  [startX, startY] = [offsetX, offsetY];
  [lastX, lastY] = [offsetX, offsetY];

  imageData = ctx.getImageData(0, 0, $canvas.width, $canvas.height);
}

function draw(e) {
  if (!isDrawing) return;

  const { offsetX, offsetY } = e;

  if (mode === MODES.DRAW || mode === MODES.ERASE) {
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

    return;
  }
  if (mode === MODES.RECTANGLE) {
    ctx.putImageData(imageData, 0, 0); //restaurar la imagen guardada
    //calcular ancho y alto del rectangulo
    let width = offsetX - startX;
    let height = offsetY - startY;

    //si shift esta presionado, hacer un cuadrado
    if (isShiftPressed) {
      const sideLength = Math.min(Math.abs(width), Math.abs(height));
      width = width > 0 ? sideLength : -sideLength;
      height = height > 0 ? sideLength : -sideLength;
    }

    //dibujando el rectangulo
    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.stroke();

    return;
  }
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

async function setMode(newMode) {
  let previousMode = mode;
  mode = newMode;
  //esto es para limpiar el boton actual activo y poner el nuevo activo
  $('button.active')?.classList.remove('active');

  if (newMode === MODES.DRAW) {
    $drawBtn.classList.add('active');
    canvas.style.cursor = 'crosshair';
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 2;
    return;
  }

  if (newMode === MODES.RECTANGLE) {
    $rectangleBtn.classList.add('active');
    canvas.style.cursor = 'ns-resize';
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineWidth = 2;
    return;
  }

  if (newMode === MODES.ERASE) {
    $ereaseBtn.classList.add('active');
    canvas.style.cursor = "url('./cursors/erase.png') 0 24, auto";
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 24;
    return;
  }

  if (newMode === MODES.PICKER) {
    $pickerBtn.classList.add('active');
    const eyeDropper = new window.EyeDropper();

    try {
      const result = await eyeDropper.open();
      const { sRGBHex } = result;
      ctx.strokeStyle = sRGBHex;
      $colorPicker.value = sRGBHex; //actualizar el color del input
      setMode(previousMode); //volver al modo dibujo despues de seleccionar color
    } catch (e) {
      //si ha habido un error o el usuario ha cancelado la seleccion
    }
    return;
  }
}

function handleKeyDown({ key }) {
  (isShiftPressed === key) === 'shift';
}

function handleKeyUp({ key }) {
  if (key === 'shift') isShiftPressed = false;
}

// show picker if browser supports it
if (typeof window.EyeDropper !== 'undefined') {
  $pickerBtn.removeAttribute('disabled'); // disable button by default
}
