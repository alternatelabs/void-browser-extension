import React, { Component } from 'react';
import Bookmarker from "./components/Bookmarker"

class App extends Component {
  render() {
    const apiRoot = ""
    const apiToken = ""
    return (
      <div className="void-ext">
        <Bookmarker
          url={window.location.href}
          host={window.location.host}
          apiRoot={apiRoot}
          apiToken={apiToken}
        />
      </div>
    );
  }
}

export default App;
