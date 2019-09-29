import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, { IAppProps } from './App';
import * as serviceWorker from './serviceWorker';

const initialData: IAppProps = {
  url: "https://pooreffort.com/",
  host: "pooreffort.com",
  apiRoot: String(process.env.REACT_APP_API_BASE_URL),
}

function loadApp(data: IAppProps) {
  const app = (
    <App
      {...data}
    />
  )

  ReactDOM.render(app, document.getElementById('root'));
}

type IBrowserTab = {
  url: string;
}
interface IBrowserTabs {
  query: (options: { active: boolean, currentWindow: boolean }) => Promise<IBrowserTab[]>
}
interface IBrowser {
  tabs: IBrowserTabs;
}

declare var browser: IBrowser

if (typeof browser !== "undefined" && browser.tabs) {
  console.log("Fetching Tabs");
  browser.tabs.query({
    active: true,
    currentWindow: true
  }).then((arrayOfTabs) => {
    const activeTab = arrayOfTabs[0];
    const parser = document.createElement("a");
    if (typeof activeTab.url === "string") {
      parser.href = activeTab.url;
      console.log("Active Tab", parser.hostname);
      loadApp({
        ...initialData,
        url: activeTab.url,
        host: parser.hostname
      });
    } else {
      console.error("Current tab doesn't have a URL", activeTab);
    }
  });
} else {
  console.log("No tabs loading add with defaults");
  loadApp(initialData);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
