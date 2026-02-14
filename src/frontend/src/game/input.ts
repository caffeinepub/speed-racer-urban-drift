export interface InputState {
  left: boolean;
  right: boolean;
  boost: boolean;
}

export class InputManager {
  private state: InputState = {
    left: false,
    right: false,
    boost: false
  };

  private keyMap: Record<string, keyof InputState> = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ' ': 'boost'
  };

  constructor() {
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  private handleKeyDown(e: KeyboardEvent) {
    const action = this.keyMap[e.key];
    if (action) {
      e.preventDefault();
      this.state[action] = true;
    }
  }

  private handleKeyUp(e: KeyboardEvent) {
    const action = this.keyMap[e.key];
    if (action) {
      e.preventDefault();
      this.state[action] = false;
    }
  }

  enable() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  disable() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }

  getState(): InputState {
    return { ...this.state };
  }

  setTouchInput(left: boolean, right: boolean, boost: boolean) {
    this.state.left = left;
    this.state.right = right;
    this.state.boost = boost;
  }

  reset() {
    this.state = {
      left: false,
      right: false,
      boost: false
    };
  }
}
