// tracing.js
export function createTracer(canvas, { onStrokeStart, onStrokeEnd }) {
  const ctx = canvas.getContext("2d");
  let isDrawing = false;
  let lastX = 0;
  let lastY = 0;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 3.2;
    ctx.strokeStyle = getComputedStyle(document.body).getPropertyValue(
      "--stroke-color"
    );
    clear(false);
  }

  function clear(resetPath = true) {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    if (resetPath) {
      isDrawing = false;
    }
  }

  function handlePointerDown(e) {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    isDrawing = true;
    lastX = x;
    lastY = y;
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (onStrokeStart) onStrokeStart();
  }

  function handlePointerMove(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
  }

  function handlePointerUp(e) {
    if (!isDrawing) return;
    e.preventDefault();
    isDrawing = false;
    if (onStrokeEnd) onStrokeEnd();
  }

  canvas.addEventListener("pointerdown", handlePointerDown);
  canvas.addEventListener("pointermove", handlePointerMove);
  window.addEventListener("pointerup", handlePointerUp);
  window.addEventListener("pointercancel", handlePointerUp);

  resize();
  window.addEventListener("resize", resize);

  return {
    clear,
    resize,
  };
}
