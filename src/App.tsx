import React, { Component } from 'react';
import Bookmarker from "./components/Bookmarker"

interface IAppProps {
  url: string;
  host: string;
  apiRoot: string;
}

class App extends Component<IAppProps, {}> {
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
