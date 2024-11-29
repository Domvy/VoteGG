import { resetTimerState } from './atoms';

let setResetTimerFunc = null;

export const setSetResetTimerFunc = (func) => {
  setResetTimerFunc = func;
};

export const setResetTimer = (value) => {
  if (setResetTimerFunc) {
    setResetTimerFunc(value);
  }
};