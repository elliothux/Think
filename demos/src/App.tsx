import * as React from 'react';
import { Route, Switch, Link } from 'wouter';
import { HooksExample } from './hooks';
import { PromiseExample } from './promise';

const demos = {
  '/': Demos,
  '/hooks': HooksExample,
  '/promise': PromiseExample,
};

export function App() {
  return (
    <Switch>
      {Object.entries(demos).map(([path, component]) => {
        return <Route key={path} path={path} component={component} />;
      })}
    </Switch>
  );
}

function Demos() {
  return (
    <ul>
      {Object.keys(demos).map((path) => (
        <li key={path}>
          <Link href={path}>{path}</Link>
        </li>
      ))}
    </ul>
  );
}
