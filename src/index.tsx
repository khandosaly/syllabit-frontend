import * as React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import {BrowserRouter} from 'react-router-dom';
import App from "./Components/App";

ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </React.Fragment>,
  document.getElementById('root'),
);
