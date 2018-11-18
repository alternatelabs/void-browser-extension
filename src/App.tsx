import React, { Component } from 'react';
import Bookmarker from "./components/Bookmarker"

interface IAppProps {
  url: string;
  host: string;
  apiRoot: string;
}

class App extends Component<IAppProps, {}> {
  render() {
    const { url, host, apiRoot } = this.props
    const apiToken = ""
    return (
      <div className="void-ext" style={{ minWidth: "480px", minHeight: "120px" }}>
        <Bookmarker
          url={url}
          host={host}
          apiRoot={apiRoot}
          apiToken={apiToken}
        />
      </div>
    );
  }
}

export default App;
