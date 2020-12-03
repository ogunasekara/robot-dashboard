import React from 'react';
import './Dashboard.css';

import Home from './PageHome';
import Sensors from './PageSensors';
import Autonomous from './PageAutonomous';
import Manual from './PageManual';

export enum DashboardPages {
  Home = "Home",
  Sensors = "Sensors",
  Manual = "Manual Control",
  Autonomous = "Autonomous Control"
}

interface DashboardState {
  contentPage: DashboardPages
}

export default class Dashboard extends React.Component<{}, DashboardState> {
  constructor(props: any) {
    super(props);

    // initialize state
    this.state = {
      contentPage: DashboardPages.Home
    };
    
    // bind functions
    this.switchPage = this.switchPage.bind(this);
  }

  switchPage(page: DashboardPages){
    this.setState({
      contentPage: page
    });
  }
  
  render() {    
    let contentComponent;

    // determine content component
    switch(this.state.contentPage)
    {
      case DashboardPages.Home:
        contentComponent = <Home/>;
        break;
      case DashboardPages.Sensors:
        contentComponent = <Sensors />;
        break;
      case DashboardPages.Manual:
        contentComponent = <Manual />;
        break;
      case DashboardPages.Autonomous:
        contentComponent = <Autonomous />;
    }

    return <div className="container">
      <div className="sidebar">
        <h1 className="logo">Dodobot</h1>
        <ul className="menuItems">
          <li className="menuItem" onClick={() => this.switchPage(DashboardPages.Home)}>Home</li>
          <li className="menuItem" onClick={() => this.switchPage(DashboardPages.Sensors)}>Sensors</li>
          <li className="menuItem" onClick={() => this.switchPage(DashboardPages.Manual)}>Manual Control</li>
          <li className="menuItem" onClick={() => this.switchPage(DashboardPages.Autonomous)}>Autonomous Control</li>
        </ul>
      </div>
      <div className="content">
        {contentComponent}
      </div>
    </div>
  }
}