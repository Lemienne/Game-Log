const scrollableOverflow = new Set(["auto", "scroll"]);
let gesture = null;
let hoveredRail = null;
let suppressClickOn = null;

function findHorizontalScroller(target) {
  for (let element = target; element; element = element.parentElement) {
    if (element === document.body || element === document.documentElement) break;
    if (element.scrollWidth > element.clientWidth && scrollableOverflow.has(getComputedStyle(element).overflowX)) {
      return element;
    }
  }
  return null;
}

document.addEventListener("pointerover", (event) => {
  if (event.pointerType !== "mouse") return;

  const rail = findHorizontalScroller(event.target);
  if (rail === hoveredRail) return;

  hoveredRail?.classList.remove("is-draggable");
  hoveredRail = rail;
  hoveredRail?.classList.add("is-draggable");
});

document.addEventListener("pointerdown", (event) => {
  suppressClickOn = null;
  if (
    event.pointerType !== "mouse" ||
    event.button !== 0 ||
    event.target.closest("button, input, textarea, select, [contenteditable]:not([contenteditable=false])")
  ) return;

  const rail = findHorizontalScroller(event.target);
  if (!rail) return;

  const link = event.target.closest("a");
  const target = link && rail.contains(link) ? link : rail;
  target.focus({ preventScroll: true });
  event.preventDefault();
  target.setPointerCapture(event.pointerId);
  gesture = { rail, id: event.pointerId, x: event.clientX, left: rail.scrollLeft };
});

document.addEventListener("pointermove", (event) => {
  if (gesture?.id !== event.pointerId) return;

  const { rail, x, left } = gesture;
  const distance = event.clientX - x;
  if (!suppressClickOn && Math.abs(distance) < 4) return;

  rail.classList.add("is-dragging");
  suppressClickOn = rail;
  rail.scrollLeft = left - distance;
});

document.addEventListener("lostpointercapture", (event) => {
  if (gesture?.id !== event.pointerId) return;

  gesture.rail.classList.remove("is-dragging");
  gesture = null;
});

document.addEventListener("dragstart", (event) => {
  if (gesture?.rail.contains(event.target)) event.preventDefault();
});

document.addEventListener("click", (event) => {
  if (event.detail > 0 && suppressClickOn?.contains(event.target)) {
    suppressClickOn = null;
    event.preventDefault();
    event.stopPropagation();
  }
}, { capture: true });
