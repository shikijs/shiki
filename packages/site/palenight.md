```tsx
import * as React from 'react';
import './App.css';
import Hello from './components/Hello';

const logo = require('./logo.svg');

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h2>Welcome to React</h2>
      </div>
      <p className="App-intro">
        To get started, edit <code>src/App.tsx</code> and save to reload.
      </p>
      <Hello name="TypeScript" />
    </div>
  );
}

export default App;
```