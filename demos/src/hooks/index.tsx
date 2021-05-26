import * as React from 'react';
// import { useState } from './hooks';
import { useCallback } from 'react';
import { useState } from './hooks';

export function HooksExample() {
  const [count, setCount] = useState<number>(0);
  const [count1, setCount1] = useState<number>(0);

  const add = useCallback(() => setCount((i: number) => i + 1), []);
  const add1 = useCallback(() => setCount1((i: number) => i + 1), []);

  return (
    <>
      <h2>手动实现 React Hooks</h2>
      <h3 onClick={add}>{count}</h3>
      <h3 onClick={add1}>{count1}</h3>
    </>
  );
}
