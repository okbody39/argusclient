// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal, Statistic, Progress,
  Table, Input,
} from 'antd';

import { Sparklines, SparklinesLine, SparklinesCurve } from 'react-sparklines';

import Highlighter from 'react-highlight-words';

import { Plus } from 'react-feather';

import Graphin, { Utils } from "../../../node_modules/@antv/graphin";

// import "../../../node_modules/@antv/graphin/dist/index.css";
// Styles
import styles from "./Network.scss";

/**
 * Network
 *
 * @class Network
 * @extends {Component}
 */
class Network extends Component {
  constructor(props) {
    super(props);

    let data = Utils.mock(13)
      .circle()
      .graphin();

    this.state = {
      data: data,
    };
  }

  // componentDidMount() {
  //   let data = Utils.mock(13)
  //     .circle()
  //     .graphin();
  //
  //   this.setState({
  //     data: data
  //   });
  // }

  render() {

    return (
      <div className={styles.container}>
        <Graphin data={this.state.data} />
        {/*<Row gutter={16}>*/}
        {/*  <Col span={16} style={{height: 300}} >*/}
        {/*    */}
        {/*  </Col>*/}

        {/*</Row>*/}

      </div>
    );
  }
}

export default Network;
