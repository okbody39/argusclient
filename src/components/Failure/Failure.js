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

// title="관리자 문의 필요"
// subTitle="재기동후에도 VM 접속이 안될 경우, 고장신고를 해주시기 바랍니다."
// extra={[
//     <Button type="primary" key="console">
//       재기동
//     </Button>,
// <Button key="buy" onClick={this.onReport.bind(this)}>
//   고장신고
// </Button>,
// ]}
class Failure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      currentDiagnosis: 0,
      currentStatus: "process", // error
      diagnosisResult: [],
      diagnosisErrors: [],
      guideTitle: "관리자 문의 필요",
      guideSubTitle: "재기동후에도 VM 접속이 안될 경우, 고장신고를 해주시기 바랍니다.",
      guideExtra: [
        <Button type="primary" onClick={this.onReport.bind(this)} key="121212">
          재기동
        </Button>,
        <Button key="buy" onClick={this.onReport.bind(this)}>
          고장신고
        </Button>,
      ]
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
    this.setState({
      current,
      currentDiagnosis: 0,
    });
    if(current === 0) {
      setTimeout(() => {
        this.doDiagnosis();
      }, 1000);
    }
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

      // console.log(result);

      this.setState({
        currentDiagnosis: d,
        diagnosisResult: [...this.state.diagnosisResult, result],
      });
    }

    // console.log(this.state.diagnosisResult);

    let diag_result = {};
    // 0 : NW
    let diag_nw = this.state.diagnosisResult[0];
    let myip = [];
    Object.keys(diag_nw).forEach(function(k){
      diag_nw[k].map((n) => {
        if(n.address.indexOf(".") !== -1 && n.family === "IPv4" && !n.internal) {
          // console.log(n);
          myip.push(n);
        }
      });
    });

    if(myip.length > 0) {
      diag_result.network = myip;
    } else {
      diag_result.network = "-";
    }

    // 1 : Client
    let diag_sw = this.state.diagnosisResult[1];
    if((diag_sw["vmwareClient"] || "" ).indexOf("Installed") !== -1) {
      diag_result.client = diag_sw["vmwareClient"];
    } else {
      diag_result.client = "-";
    }

    // 2 : MY VM
    let diag_vm = this.state.diagnosisResult[2];
    let myvm = [];
    let availableState = [
      "CUSTOMIZING",
      "CONNECTED",
      "DISCONNECTED",
      "AVAILABLE",
    ];
    diag_vm.map((vm) => {
      if(availableState.indexOf(vm.basicState) !== -1) {
        myvm.push(vm);
      }
    });
    if(myvm.length > 0) {
      diag_result.vm = myvm;
    } else {
      diag_result.vm = "-";
    }

    // 3 : Server
    let diag_svr = this.state.diagnosisResult[3];

    if(diag_svr.avg > 10) {
      diag_result.service = "-";
    } else {
      diag_result.service = diag_svr;
    }

    // console.log(diag_result);

    let result = [];
    let resultQuide = null;
    Object.keys(diag_result).forEach(function(k){
      if(diag_result[k] === "-") {
        switch(k) {
          case "network":
            result.push("네트워크가 끊어져 있습니다.");

            resultQuide = {
              guideTitle: "네트워크 재설정",
              guideSubTitle: "접속하신 컴퓨터의 네트워크 환경 설정을 다시 확인해 주시기 바랍니다.",
              guideExtra: [
                <Button type="primary" onClick={() => this.onReport()} key="21212">
                  목록으로
                </Button>
              ]
            };

            break;

          case "client":
            result.push("VMware Horizon Client가 설치 되지 않았습니다.");

            resultQuide = {
              guideTitle: "필수 프로그램 확인",
              guideSubTitle: "접속을 위한 필수 프로그램이 설치되어 있지 않습니다. (VMware Horizon Client)",
              guideExtra: [
                <Button type="primary" onClick={() => this.onReport()} key="21212">
                  프로그램 다운로드
                </Button>
              ]
            };

            break;

          case "vm":
            result.push("사용 가능한 가상머신이 없습니다.");

            resultQuide = {
              guideTitle: "가상머신 확인",
              guideSubTitle: "사용자에게 할당된 가상머신이 없습니다. 고장신고해주세요.",
              guideExtra: [
                <Button key="buy" onClick={() => this.onReport()}>
                  고장신고
                </Button>,
              ]
            };

            break;

            case "service":
              result.push("서버와의 통신이 불안정합니다.");
  
              resultQuide = {
                guideTitle: "서버 상태 확인",
                guideSubTitle: "서버의 상태가 불안정 합니다. 관리자에게 상황을 통보하였습니다.",
                guideExtra: [
                  <Button key="buy" onClick={() => this.onReport()}>
                    고장신고
                  </Button>,
                ]
              };
  
              break;
          }
      }
    });

    // console.log(result.join("|"));
    if(resultQuide) {
      this.setState(resultQuide);
    }

    this.setState({
      current: result.length > 0 ? 3 : 1,
      currentDiagnosis: 4,
      diagnosisErrors: result,
    });

  }

  goSignin() {
    this.props.history.push("/signin");
  }

  onReport() {
    let param = {};

    param.username = this.props.auth;
    param.gb = this.state.selectedType;
    param.content = result;

    console.log(JSON.stringify(param));

    // let reply = window.ipcRenderer.sendSync("failure-apply", param);

    this.props.history.push('/history/failure');
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
            title={this.state.guideTitle}
            subTitle={this.state.guideSubTitle}
            extra={this.state.guideExtra}
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

        {
          this.state.diagnosisErrors.map((err, idx) => {
            return (
              <Alert key={idx} message={err} type="error" showIcon />
            );
          })
        }

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
