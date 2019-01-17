import React, { Component } from 'react';
import './App.css';

import { HashRouter as Router, Route, Link } from "react-router-dom";

import Main from './components/Main/Main';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <Main />
        </Router>
      </div>
    );
  }
}

export default App;
