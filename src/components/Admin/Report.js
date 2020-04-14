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

// Styles
import styles from "./Report.scss";

/**
 * Report
 *
 * @class Report
 * @extends {Component}
 */
class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    return (
      <div className={styles.container}>
        <Row gutter={16}>
          <Col span={6}>
            <div className={styles.stat}>
              <Statistic title="총 사용 시간" value={112893} />
              <Sparklines data={[5, 10, 5, 20, 50, 0, 30]} height={40}>
                <SparklinesCurve color="blue" />
              </Sparklines>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.stat}>
              <Statistic title="장애신고" value={20} />
              <Sparklines data={[5, 10, 5, 20, 100, 25]} height={40}>
                <SparklinesCurve color="red" />
              </Sparklines>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.stat}>
              <Statistic title="사용자" value="20 / 4,565" />
              <Sparklines data={[5, 10, 5, 20, 30, 25]} height={40}>
                <SparklinesLine color="green" />
              </Sparklines>
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.stat}>
              <Statistic title="가상머신" value="100 / 5,842" />
              <Sparklines data={[5, 10, 5, 20, 0, 25]} height={40}>
                <SparklinesLine />
              </Sparklines>
            </div>
          </Col>

          <Col span={16}>
            <Card title="VIP 현황" >

            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

export default Report;
