import { render } from '../index';

let memorizedState: any[] = [];
let index = 0;

export const useState = <T = any>(initialState: T) => {
  let currentIndex = index;
  memorizedState[currentIndex] = memorizedState[index] || initialState;
  const setState = (newState: T) => {
    memorizedState[currentIndex] = typeof newState === 'function' ? newState(memorizedState[currentIndex]) : newState;
    update();
  };
  return [memorizedState[index++], setState];
};

function update() {
  index = 0;
  render();
}
