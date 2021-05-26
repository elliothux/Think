import * as React from 'react';
import { Route, Switch, Link } from 'wouter';
import { HooksExample } from './hooks';

const demos = {
  '/': Demos,
  '/hooks': HooksExample,
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
        <li>
          <Link key={path} href={path}>
            {path}
          </Link>
        </li>
      ))}
    </ul>
  );
}
