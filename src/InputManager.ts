import * as THREE from "three";

interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  mouseButtons: {
    left: boolean;
  };
}

export class InputManager {
  inputs: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    mouseButtons: {
      left: false,
    },
  };

  mouseNdc = new THREE.Vector2(0, 0);
  private _crossHairEl: HTMLDivElement;

  constructor() {
    window.addEventListener("keydown", (e: KeyboardEvent) =>
      this._set(e.code, true),
    );
    window.addEventListener("keyup", (e: KeyboardEvent) =>
      this._set(e.code, false),
    );
    window.addEventListener("mousemove", (e: MouseEvent) =>
      this._onMouseMove(e),
    );
    window.addEventListener("mousedown", (e: MouseEvent) =>
      this._onMouseButton(e, true),
    );
    window.addEventListener("mouseup", (e: MouseEvent) =>
      this._onMouseButton(e, false),
    );

    document.body.style.cursor = "none";
    this._crossHairEl = this._createCrosshairEl();
    document.body.appendChild(this._crossHairEl);
  }

  private _set(code: string, val: boolean): void {
    if (code === "KeyW") this.inputs.up = val;
    if (code === "KeyS") this.inputs.down = val;
    if (code === "KeyA") this.inputs.left = val;
    if (code === "KeyD") this.inputs.right = val;
  }

  private _onMouseMove(e: MouseEvent) {
    this.mouseNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouseNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;

    this._crossHairEl.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
  }

  private _onMouseButton(e: MouseEvent, val: boolean) {
    if (e.button === 0) this.inputs.mouseButtons.left = val;
  }

  private _createCrosshairEl() {
    const el = document.createElement("div");
    el.style.position = "fixed";
    el.style.top = "0";
    el.style.left = "0";
    el.style.width = "32px";
    el.style.height = "32px";
    el.style.pointerEvents = "none";
    el.style.zIndex = "9999";
    el.style.willChange = "transform";
    el.innerHTML = `
      <svg width="32" height="32" viewBox="0 0 32 32">
        <circle cx="16" cy="16" r="9" fill="none" stroke="#44ccff" stroke-width="1.5" />
        <line x1="16" y1="1"  x2="16" y2="9"  stroke="#44ccff" stroke-width="1.5" />
        <line x1="16" y1="23" x2="16" y2="31" stroke="#44ccff" stroke-width="1.5" />
        <line x1="1"  y1="16" x2="9"  y2="16" stroke="#44ccff" stroke-width="1.5" />
        <line x1="23" y1="16" x2="31" y2="16" stroke="#44ccff" stroke-width="1.5" />
      </svg>`;
    return el;
  }
}
