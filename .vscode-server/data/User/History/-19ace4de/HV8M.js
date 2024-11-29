
import { atom } from 'recoil';

export const resetTimerState = atom({
  key: 'resetTimerState', // Atom의 고유 키
  default: false,
});