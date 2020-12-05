import { resolveSoa } from 'dns';
import React from 'react';
import { CompressedImage, DodobotBatteryState, DodobotBumperState, DodobotDriveState, DodobotFSRsState, DodobotGripperState, DodobotLinearState } from './Sensors';

var roslib = require('roslib');

// constants
const WS_URL = 'ws://192.168.0.26:8080';

interface SensorsProps {
}

interface SensorsState {
  ros: any,

  // ros state
  battery?: DodobotBatteryState,
  bumper?: DodobotBumperState,
  drive?: DodobotDriveState,
  fsrs?: DodobotFSRsState,
  gripper?: DodobotGripperState,
  linear?: DodobotLinearState,
  image?: CompressedImage
  // other params: DateConstructor
  time: any
}

export default class Sensors extends React.Component<SensorsProps,SensorsState> {
  constructor(props:SensorsProps) {
    super(props);

    // setup state variables
    this.state = {
      ros: new roslib.Ros(),
      time: new Date().getTime()
    };

    // bind handlers
    this.batteryCallback = this.batteryCallback.bind(this);
    this.bumperCallback = this.bumperCallback.bind(this);
    this.driveCallback = this.driveCallback.bind(this);
    this.fsrsCallback = this.fsrsCallback.bind(this);
    this.gripperCallback = this.gripperCallback.bind(this);
    this.linearCallback = this.linearCallback.bind(this);
    this.imageCallback = this.imageCallback.bind(this);
  }

  componentDidMount() {
    this.initializeROS();
    this.initializePubsSubs(); 
  }

  componentWillUnmount() {
    this.state.ros.close();
  }

  initializeROS() {
    this.state.ros.on('error', (error: any) => console.log(error));
    this.state.ros.on('connection', (error: any) => console.log('Connection made!'));
    this.state.ros.on('close', (error: any) => console.log('Connection closed.'));
    this.state.ros.connect(WS_URL);
  }

  initializePubsSubs() {
    // chatter sub
    var batterySub = new roslib.Topic({
      ros: this.state.ros,
      name: '/dodobot/battery',
      messageType: 'sensor_msgs/BatteryState'
    });

    var bumperSub = new roslib.Topic({
      ros: this.state.ros,
      name: '/dodobot/bumper',
      messageType: 'db_parsing/DodobotBumper'
    });

    var driveSub = new roslib.Topic({
      ros: this.state.ros,
      name: '/dodobot/drive',
      messageType: 'db_parsing/DodobotDrive'
    });

    var fsrsSub = new roslib.Topic({
      ros: this.state.ros,
      name: '/dodobot/fsrs',
      messageType: 'db_parsing/DodobotFSRs'
    });

    var gripperSub = new roslib.Topic({
      ros: this.state.ros,
      name: '/dodobot/gripper',
      messageType: 'db_parsing/DodobotGripper'
    });

    var linearSub = new roslib.Topic({
      ros: this.state.ros,
      name: '/dodobot/linear',
      messageType: 'db_parsing/DodobotLinear'
    });

    var imageSub = new roslib.Topic({
      ros: this.state.ros,
      name: '/camera/color/image_raw/compressed',
      messageType: 'sensor_msgs/CompressedImage'
    });

    batterySub.subscribe(this.batteryCallback);
    bumperSub.subscribe(this.bumperCallback);
    driveSub.subscribe(this.driveCallback);
    fsrsSub.subscribe(this.fsrsCallback);
    gripperSub.subscribe(this.gripperCallback);
    linearSub.subscribe(this.linearCallback);
    imageSub.subscribe(this.imageCallback);
  }

  // ROS Callback Functions
  batteryCallback(message: any) {
    this.setState({
      battery: {
        voltage: message.voltage,
        current: message.current
      }
    });
  }

  bumperCallback(message: any) {
    this.setState({
      bumper: {
        left: message.left,
        right: message.right
      }
    });
  }

  driveCallback(message: any) {
    this.setState({
      drive: {
        left_setpoint: message.left_setpoint,
        right_setpoint: message.right_setpoint,
        left_enc_pos: message.left_enc_pos,
        right_enc_pos: message.right_enc_pos,
        left_enc_speed: message.left_enc_speed,
        right_enc_speed: message.right_enc_speed,
        left_bumper: message.left_bumper,
        right_bumper: message.right_bumper
      }
    });
  }

  fsrsCallback(message: any) {
    this.setState({
      fsrs: {
        left: message.left,
        right: message.right
      }
    });
  }

  gripperCallback(message: any) {
    this.setState({
      gripper: {
        position: message.position,
        force_threshold: message.force_threshold
      }
    });
  }

  linearCallback(message: any) {
    this.setState({
      linear: {
        position: message.position,
        has_error: message.has_error,
        is_homed: message.is_homed,
        is_active: message.is_active,
        command_type: message.command_type,
        command_value: message.command_value,
        max_speed: message.max_speed,
        acceleration: message.acceleration
      }
    })
  }

  imageCallback(message: any) {
    const imgSrc = "data:image/jpg;base64, " + message.data;

    const newTime = new Date().getTime();
    const fps = 1000 / (newTime - this.state.time);
    
    this.setState({
      image: {
        //format: message.format,
        //data: message.data,
        imageSrc: imgSrc,
        fps: fps
      },

      time: newTime
    });
  }
  
  render() {
    const battery = this.state.battery;
    const bumper = this.state.bumper;
    const drive = this.state.drive;
    const fsrs = this.state.fsrs;
    const image = this.state.image;
    
    return <div>
      <div hidden={!battery}>
        <h2>Battery</h2>
        <p><b>Voltage:</b> {battery?.voltage}</p>
        <p><b>Current:</b> {battery?.current}</p>
        <hr/>
      </div>
      <div hidden={!bumper}>
        <h2>Bumper</h2>
        <p><b>Left:</b> {bumper?.left}</p>
        <p><b>Right:</b> {bumper?.right}</p>
        <hr/>
      </div>
      <div hidden={!drive}>
        <h2>Drive</h2>
        <p><b>Left Enc Pos:</b> {drive?.left_enc_pos}</p>
        <p><b>Right Enc Pos:</b> {drive?.right_enc_pos}</p>
        <hr/>
      </div>
      <div hidden={!fsrs}>
        <h2>Force Sensors</h2>
        <p><b>Left:</b> {fsrs?.left}</p>
        <p><b>Right:</b> {fsrs?.right}</p>
      </div>
      <div hidden={!image}>
        {/* Image format: {image?.format}<br/> */}
        {/* Data: {image?.data}<br/> */}
        FPS: {image?.fps}<br/>
        <img style={{width:"700"}} src={image?.imageSrc}></img>
      </div>
    </div>
  }
}