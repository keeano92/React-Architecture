import React, { } from 'react';
import './App.css';
import FarmLaunch from '../../assets/images/Farm Launch.png'

//Component Imports
//Using the "layout" folder because this is root app
import { header as Header } from '../layout/header'
import { landing as Landing } from '../layout/landing'
import { footer as Footer } from '../layout/footer'

function App() {
  return (
    <div className="container">
      {/* Header */}
      <div className="header-container">
        <Header />
      </div>
      {/* Hero Banner */}
      <div className="hero-banner">
        <img src={FarmLaunch} />
      </div>
      {/* Login/Sign-Up Buttons */}
      <Landing />
      {/* Footer */}
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default App;
