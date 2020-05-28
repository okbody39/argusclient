// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal,
  Steps, Result, Typography,
  Table, Input, Form, Slider, Radio, Select, Checkbox, InputNumber, notification,
} from 'antd';
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const { Paragraph, Text } = Typography;

import Highlighter from 'react-highlight-words';


import { Plus } from 'react-feather';
import { withRouter } from "react-router-dom";

// Styles
import styles from "./Change.scss";

// Sub components
import ChangeResource from "./ChangeResource";
import ChangeIPAddress from "./ChangeIPAddress";

/**
 * Change
 *
 * @class Change
 * @extends {Component}
 */
class Change extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      result: {},
      selectedComp: null,
      selectedType: null,
    };

    this.ChangeType = [
      {
        id: "CHANGE_RESOURCE",
        name: "자원 증설",
        component: <ChangeResource {...props} setResult={this.setResult.bind(this)} />,
      },
      {
        id: "CHANGE_IP",
        name: "IP 변경",
        component: <ChangeIPAddress {...props} setResult={this.setResult.bind(this)} />,
      },
    ];
  }

  setResult(result) {
    const current = this.state.current + 1;

    let param = {};
    param.username = this.props.auth;
    param.gb = this.state.selectedType;
    param.content = result;

    console.log(JSON.stringify(param));

    let reply = window.ipcRenderer.sendSync("change-apply", param);

    console.log(JSON.stringify(reply));

    this.setState({
      result: result,
      current: current,
    });

  }

  next(id) {
    const current = this.state.current + 1;

    this.ChangeType.map((comp) => {
      let selectedComp = null;

      if(comp.id === id) {
        this.setState({
          selectedType: comp.id,
          selectedComp: comp.component,
          current: current,
        });
      }
    });

  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  goStep(current) {
    this.setState({ current });
  }

  onComplete() {
    // SAVE
    this.props.history.push('/history/change');
  }

  render() {
    const { current } = this.state;

    const steps = [
      {
        title: '유형 선택',
        content: (
          <div className={styles.inner}>
            <Row gutter={[16, 16]}>
              {
                this.ChangeType.map((ch) => {
                  return (
                    <Col key={ch.id} span={6}>
                      <Button block onClick={this.next.bind(this, ch.id)} style={{height: 100}}>{ch.name}</Button>
                    </Col>
                  )
                })
              }
              {/*<Col span={6}>*/}
              {/*  <Button block onClick={this.next.bind(this)} style={{height: 100}}>자원 증설 신청</Button>*/}
              {/*</Col>*/}
              {/*<Col span={6}>*/}
              {/*  <Button block onClick={this.next.bind(this)} style={{height: 100}}>OS 재설치 신청</Button>*/}
              {/*</Col>*/}
              {/*<Col span={6}>*/}
              {/*  <Button block onClick={this.next.bind(this)} style={{height: 100}}>인수인계 신청</Button>*/}
              {/*</Col>*/}
              {/*<Col span={6}>*/}
              {/*  <Button block onClick={this.next.bind(this)} style={{height: 100}}>IP 변경 신청</Button>*/}
              {/*</Col>*/}
              {/*<Col span={6}>*/}
              {/*  <Button block onClick={this.next.bind(this)} style={{height: 100}}>사용기간 연장</Button>*/}
              {/*</Col>*/}
              {/*<Col span={6}>*/}
              {/*  <Button block onClick={this.next.bind(this)} style={{height: 100}}>반납 신청</Button>*/}
              {/*</Col>*/}
              {/*<Col span={6}>*/}
              {/*  <Button block onClick={this.next.bind(this)} style={{height: 100}}>백업 신청</Button>*/}
              {/*</Col>*/}
              {/*<Col span={6}>*/}
              {/*  <Button block onClick={this.next.bind(this)} style={{height: 100}}>보안 예외 신청</Button>*/}
              {/*</Col>*/}
            </Row>
            {/*<Button block>사용기간 연장</Button>*/}
            {/*<Button block>반납 신청</Button>*/}
            {/*<Button block>백업 신청</Button>*/}
            {/*<Button block>보안 예외 신청</Button>*/}
            {/*<Button block>USB 사용 권한 신청</Button>*/}
            {/*<Button block>Printer 사용 권한 신청</Button>*/}
          </div>
        ),
      },
      {
        title: '신청 정보 입력',
        content: (
          <div className={styles.inner}>
            {
              this.state.selectedComp
            }
          </div>
        ),
      },
      {
        title: '신청 정보 전송',
        content: (
          <Result
            status="success"
            title="신청이 완료 되었습니다."
            subTitle="관리자의 승인 후 작업이 완료됩니다."
            extra={[
              // <Button type="primary" key="console">
              //   재기동
              // </Button>,
              <Button key="buy" onClick={this.onComplete.bind(this)}>확인</Button>,
            ]}
          >
            <div className="desc">
              <Paragraph>
                <Text
                  strong
                  style={{
                    fontSize: 16,
                  }}
                >
                  신청 결과:
                </Text>
              </Paragraph>
              <Paragraph>
                {JSON.stringify(this.state.result)}
              </Paragraph>
              {/*<Paragraph>*/}
              {/*  <Icon style={{ color: 'red' }} type="close-circle" /> Your account has been frozen*/}
              {/*  <a>Thaw immediately &gt;</a>*/}
              {/*</Paragraph>*/}
              {/*<Paragraph>*/}
              {/*  <Icon style={{ color: 'red' }} type="close-circle" /> Your account is not yet eligible to*/}
              {/*  apply <a>Apply Unlock &gt;</a>*/}
              {/*</Paragraph>*/}
            </div>
          </Result>
        ),
      },
    ];

    return (
      <div className={styles.container}>
        <Steps current={current} onChange={this.goStep.bind(this)}>
          {steps.map(item => (
            <Step key={item.title} title={item.title}/>
          ))}
        </Steps>
        <div>{steps[current].content}</div>
        {/*<div className="steps-action">*/}
        {/*  {current < steps.length - 1 && (*/}
        {/*    <Button type="primary" onClick={() => this.next()}>*/}
        {/*      Next*/}
        {/*    </Button>*/}
        {/*  )}*/}
        {/*  {current === steps.length - 1 && (*/}
        {/*    <Button type="primary" onClick={() => message.success('Processing complete!')}>*/}
        {/*      Done*/}
        {/*    </Button>*/}
        {/*  )}*/}
        {/*  {current > 0 && (*/}
        {/*    <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>*/}
        {/*      Previous*/}
        {/*    </Button>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default withRouter(Change);
