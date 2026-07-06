interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export class InputManager {
  keys: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
  };

  constructor() {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      this._set(e.code, true);
    });
    window.addEventListener("keyup", (e: KeyboardEvent) => {
      this._set(e.code, false);
    });
  }

  private _set(code: string, val: boolean): void {
    if (code === "KeyW") this.keys.up = val;
    if (code === "KeyS") this.keys.down = val;
    if (code === "KeyA") this.keys.left = val;
    if (code === "KeyD") this.keys.right = val;
  }
}
