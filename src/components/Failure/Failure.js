// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal,
  Steps, Result, Typography,
  Table, Input,
} from 'antd';
const { Step } = Steps;
const { Paragraph, Text } = Typography;
import { Link, withRouter } from 'react-router-dom';

import Highlighter from 'react-highlight-words';

import { Plus } from 'react-feather';

// Styles
import styles from "./Failure.scss";

/**
 * Failure
 *
 * @class Failure
 * @extends {Component}
 */
class Failure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      currentDiagnosis: 0,
      currentStatus: "process", // error
      diagnosisResult: [],
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  goStep(current) {
    this.setState({ current });
  }

  componentDidMount() {
    setTimeout(() => {
      this.doDiagnosis();
    }, 1000);
  }

  componentWillUnmount() {
  }

  doDiagnosis() {

    for(let d=0 ; d<4 ; d++) {
      let result = window.ipcRenderer.sendSync("failure-diagnosis", { step: d, auth: this.props.auth });

      console.log(result);
  
      this.setState({
        current: 1,
        currentDiagnosis: d,
        diagnosisResult: [...this.state.diagnosisResult, result],
      });  
    }
    this.setState({
      currentDiagnosis: 4,
    });

  }

  goSignin() {
    this.props.history.push("/signin");
  }

  render() {
    const { current } = this.state;

    const steps = [
      {
        title: '진단',
        content: (
          <div className={styles.inner}>
            <Steps direction="vertical" size="small" current={this.state.currentDiagnosis} status={this.state.currentStatus}>
              <Step title="네트워크 확인" description="접속을 위한 네트워크 상태를 확인 합니다." />
              <Step title="필수 SW 설치/상태 확인" description="접속에 필요한 필수SW의 설치 및 상태를 확인합니다." />
              <Step title="VM 상태 확인" description="할당된 VM이 접속 가능한 상태인지 확인합니다." />
              <Step title="서버 상태 확인" description="서버의 서비스 상태를 확인 합니다." />
            </Steps>
          </div>
        ),
      },
      {
        title: '장애 유형 선택',
        content: (
          <div className={styles.inner}>
            <Button block onClick={this.next.bind(this)}>접속 문제</Button>
            <Button block>설치 문의</Button>
            <Button block>사용 문의</Button>
            <Button block>기타 문의</Button>
          </div>
        ),
      },
      {
        title: '세부 유형 선택',
        content: (
          <div className={styles.inner}>
            <Button block onClick={this.next.bind(this)}>VM이 보이지 않습니다.</Button>
            <Button block>접속시 로딩시간이 많이 소요됩니다.</Button>
            <Button block onClick={this.next.bind(this)}>접속이 되지 않습니다.</Button>
          </div>
        ),
      },
      {
        title: '장애 조치 가이드',
        content: (
          <Result
            // status="success"
            title="관리자 문의 필요"
            subTitle="재기동후에도 VM 접속이 안될 경우, 고장신고를 해주시기 바랍니다."
            extra={[
              <Button type="primary" key="console">
                재기동
              </Button>,
              <Button key="buy">고장신고</Button>,
            ]}
          >
            {/*<div className="desc">*/}
            {/*  <Paragraph>*/}
            {/*    <Text*/}
            {/*      strong*/}
            {/*      style={{*/}
            {/*        fontSize: 16,*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      The content you submitted has the following error:*/}
            {/*    </Text>*/}
            {/*  </Paragraph>*/}
            {/*  <Paragraph>*/}
            {/*    <Icon style={{ color: 'red' }} type="close-circle" /> Your account has been frozen*/}
            {/*    <a>Thaw immediately &gt;</a>*/}
            {/*  </Paragraph>*/}
            {/*  <Paragraph>*/}
            {/*    <Icon style={{ color: 'red' }} type="close-circle" /> Your account is not yet eligible to*/}
            {/*    apply <a>Apply Unlock &gt;</a>*/}
            {/*  </Paragraph>*/}
            {/*</div>*/}
          </Result>
        ),
      },
    ];

    return (
      <div className={this.props.auth ? styles.container : styles.container_noback}>
        <Steps current={current} onChange={this.goStep.bind(this)}>
          {steps.map(item => (
            <Step key={item.title} title={item.title}/>
          ))}
        </Steps>
        <div>{steps[current].content}</div>
        { !this.props.auth &&
        <div className="steps-action">
          <Button style={{ marginLeft: 8 }} onClick={this.goSignin.bind(this)}>
            종료
          </Button>
        </div>
        }

      </div>
    );
  }
}

export default withRouter(Failure);
