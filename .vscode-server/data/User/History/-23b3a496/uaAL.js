// src/stores/setTimerState.js

let handleTurnChangeFunc = null;

export function registerHandleTurnChangeFunc(func) {
  handleTurnChangeFunc = func;
}

export function triggerHandleTurnChange() {
  if (handleTurnChangeFunc) {
    handleTurnChangeFunc();
  }
}