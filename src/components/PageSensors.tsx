import { resolveSoa } from 'dns';
import React from 'react';

var roslib = require('roslib');

// constants
const WS_URL = 'ws://192.168.0.26:8080';

interface SensorsProps {

}

interface SensorsState {
  ros: any,
  value: string
}

export default class Sensors extends React.Component<SensorsProps,SensorsState> {
  constructor(props:SensorsProps) {
    super(props);

    // setup state variables
    this.state = {
      ros: new roslib.Ros(),
      value: ""
    };

    // bind handlers
    this.chatterCallback = this.chatterCallback.bind(this);
  }

  componentDidMount() {
    this.initializeROS();
    this.initializePubsSubs(); 
  }

  initializeROS() {
    this.state.ros.on('error', (error: any) => console.log(error));
    this.state.ros.on('connection', (error: any) => console.log('Connection made!'));
    this.state.ros.on('close', (error: any) => console.log('Connection closed.'));
    this.state.ros.connect(WS_URL);
  }

  initializePubsSubs() {
    // chatter sub
    var chatterSub = new roslib.Topic({
      ros: this.state.ros,
      name: '/chatter',
      messageType: 'std_msgs/String'
    });

    chatterSub.subscribe(this.chatterCallback);
  }

  // ROS Callback Functions
  chatterCallback(message: any) {
    this.setState({
      value: message.data
    });
  }
  
  render() {
    return <h1>Received message: {this.state.value}</h1>
  }
}