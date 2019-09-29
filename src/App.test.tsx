import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const exampleProps = {
  url: "https://pooreffort.com/",
  host: "pooreffort.com",
  apiRoot: "https://api.voidapp.co/"
}

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App {...exampleProps} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
