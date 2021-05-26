import * as React from 'react';
import { useCallback } from 'react';

export function PromiseExample() {
  const onClick = useCallback(() => {
    new Promise((resolve, reject) => {}).then(result => {

    });
  }, []);

  return (
    <div>
      <h2>手动实现 Promise</h2>
    </div>
  );
}
