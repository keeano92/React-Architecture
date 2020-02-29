import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

//This will be a good start for testing, since it is included. 
//We will want to make sure the application is always rendered.
//We will also want to check user persistance here
//We can automate via Pipelines with Heroku

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
