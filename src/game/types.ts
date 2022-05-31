type History = {
  openCards: Array<number | undefined>,
  foundationCards: Array<number | undefined>,
  cascades: number[][],
};

export type GameState = {
  loading: boolean,
  gameNum?: number,
  openCards: Array<number | undefined>,
  foundationCards: Array<number | undefined>,
  cascades: number[][],
  activeCard?: number,
  history: History[],
  moveCount: number,
  wasLastUndo: boolean,
  elapsedTime: number,
  paused: boolean,
};

export interface Reset {
  type: 'reset';
}

export interface NewGame {
  type: 'new_game';
}

export interface SetState {
  type: 'set_state';
  state: GameState;
}

export interface Undo {
  type: 'undo';
}

export interface OpenCellClick {
  type: 'open_cell_click';
  cellIndex: number,
}

export interface CascadeClick {
  type: 'cascade_click';
  cascadeIndex: number;
}

export interface Move {
  type: 'move';
}

export interface UpdateElapsedTime {
  type: 'update_elapsed_time';
  elapsedTime: number;
}

export interface Pause {
  type: 'pause';
  paused: boolean;
}

export type Action =
  | Reset
  | NewGame
  | SetState
  | Undo
  | OpenCellClick
  | CascadeClick
  | Move
  | UpdateElapsedTime
  | Pause
  // eslint-disable-next-line semi-style
  ;
