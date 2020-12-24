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
const { TextArea } = Input;

const async = require('async');

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
            diagnosisReport: {},
            diagnosisResult: [],
            diagnosisErrors: [],

            failureDetailType: [],
            failureEtcText: "",

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

        // this.doDiagnosis = this.doDiagnosis.bind(this);
        this.setStateFunc = this.setStateFunc.bind(this);

    }

    onChange = (e) => {
        // console.log(e.target.value)
        this.setState({ failureEtcText: e.target.value });
    };

    next(type) {
        const current = this.state.current + 1;
        let failureDetailType = [];
        let detailTypes = this.state.Codes;

        // 장애 유형 선택
        if(this.state.current === 1) {
            if(type === "ETC") {
                let tt = {
                    key: "ETC", text: "",
                    guide: {
                        guideTitle: "관리자 문의 필요",
                        guideSubTitle: "고장신고를 클릭하시면 입력하신 문의 사항이 신고됩니다.",
                        guideExtra: ["고장신고"],
                    }
                };

                failureDetailType.push(
                    <div>
                        <TextArea
                            key="ETC-TEXT"
                            onChange={this.onChange}
                            placeholder="운영자에게 문의하실 사항을 입력해 주세요."
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            style={{ marginBottom: 10 }}
                        />
                        <Button block onClick={this.next.bind(this, tt)} key="ETC">내용을 전송합니다.</Button>
                    </div>
                )
            } else {
                detailTypes[type].map((t) => {
                    failureDetailType.push(
                        <Button block onClick={this.next.bind(this, t)} key={t.key}>{t.text}</Button>
                    )
                });
            }

            this.setState({
                failureDetailType,
            });

        }

        // 세부 유형 선택
        if(this.state.current === 2) {
            let guideExtra = [];

            type.guide.guideExtra.map((btn) => {
                switch(btn) {
                    case "재기동":
                        guideExtra.push(
                            <Button type="primary" onClick={this.onReport.bind(this)}>
                                재기동
                            </Button>
                        );
                        break;

                    case "고장신고":
                        guideExtra.push(
                            <Button onClick={this.onReport.bind(this)}>
                                고장신고
                            </Button>
                        );
                        break;

                    case "다운로드":
                        guideExtra.push(
                            <Button type="primary" onClick={() => this.onReport()}>
                                프로그램 다운로드
                            </Button>
                        );
                        break;
                    default:
                        if(btn.indexOf("이동|") !== -1) {

                            guideExtra.push(
                                <Button type="primary" onClick={() => this.goUrl(btn.replace("이동|",""))}>
                                    화면이동
                                </Button>
                            );

                        }
                }
            });

            if(type.key === "ETC") {
                this.setState({
                    selectedType: type.key,
                    guideTitle: type.guide.guideTitle,
                    guideSubTitle: type.guide.guideSubTitle,
                    guideExtra: guideExtra,
                });
            } else {
                this.setState({
                    selectedType: type.key,
                    guideTitle: type.guide.guideTitle,
                    guideSubTitle: type.guide.guideSubTitle,
                    guideExtra: guideExtra,
                    failureEtcText: type.text,
                });
            }


        }

        this.setState({
            current,
        });
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
        let _codes = window.ipcRenderer.sendSync("failure-code");
        let codes = {};

        _codes.map((code) => {
            if(code.gb.indexOf("FAILURE-")  !== -1) {
                let gb = code.gb.split("-");
                let g = gb[1];

                if(codes[g]) {
                    //
                } else {
                    codes[g] = [];
                }

                codes[g].push({
                    key: code.cd,
                    text: code.nm,
                    guide: JSON.parse(code.content),
                });
            }
        });

        // console.log(codes);

        this.setState({
           Codes: codes
        });

        setTimeout(() => {
            this.doDiagnosis();
        }, 1000);
    }

    componentWillUnmount() {
    }

    setStateFunc(step) {
        let auth = this.props.auth;
        let result = window.ipcRenderer.sendSync("failure-diagnosis", { step: step, auth: auth });

        this.setState({
            currentDiagnosis: step,
            diagnosisResult: [...this.state.diagnosisResult, result],
        });
    }

    doDiagnosis() {
        let auth = this.props.auth;

        for(let d=0 ; d<4 ; d++) {
            let result = window.ipcRenderer.sendSync("failure-diagnosis", { step: d, auth: this.props.auth });

            // console.log(result);

            this.setState({
                currentDiagnosis: d,
                diagnosisResult: [...this.state.diagnosisResult, result],
            });
        }

        // async.waterfall([
        //   function(callback) {
        //     this.setStateFunc(0);
        //
        //     callback(null);
        //   },
        //   function(callback) {
        //     this.setStateFunc(1);
        //
        //     callback(null);
        //   },
        //   function(callback) {
        //     this.setStateFunc(2);
        //
        //     callback(null);
        //   },
        //   function(callback) {
        //     this.setStateFunc(3);
        //
        //     callback(null);
        //   },
        //
        // ], function (err, result) {
        //   // result now equals 'done'
        // });




        // console.log(this.state.diagnosisResult);
        let result = [];
        let resultQuide = null;
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
            diag_result.network = { result: true, content: myip };
        } else {
            diag_result.network = { result: false, content: diag_nw };
        }

        // 1 : Client
        let diag_sw = this.state.diagnosisResult[1];
        if((diag_sw["vmwareClient"] || "" ).indexOf("Installed") !== -1) {
            diag_result.client = { result: true, content: diag_sw["vmwareClient"] };
        } else {
            diag_result.client = { result: true, content: diag_sw["vmwareClient"] };
        }

        // 2 : MY VM
        let diag_vm = this.state.diagnosisResult[2];
        // let myvm = [];
        // let availableState = [
        //   "CUSTOMIZING",
        //   "CONNECTED",
        //   "DISCONNECTED",
        //   "AVAILABLE",
        // ];
        // diag_vm.map((vm) => {
        //   if(availableState.indexOf(vm.basicState) !== -1) {
        //     myvm.push(vm);
        //   }
        // });
        if(diag_vm.length > 0) {
            diag_result.vm = { result: true, content: diag_vm };
        } else {
            diag_result.vm = { result: false, content: diag_vm };
        }

        // 3 : Server
        let diag_svr = this.state.diagnosisResult[3];
        diag_result.service = { result: true, content: diag_svr };
        diag_svr.map((svr) => {
            if(svr.avg > 2000)  { // ms
                if(diag_result.service.result) {
                    diag_result.service.result = false;
                }
            }
        });

        console.log(diag_result);

        Object.keys(diag_result).forEach(function(k){
            if(!diag_result[k].result) {
                switch(k) {
                    case "network":
                        result.push("네트워크가 끊어져 있습니다.");

                        resultQuide = {
                            selectedType: "DIAGNOSIS",
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
                            selectedType: "DIAGNOSIS",
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
                            selectedType: "DIAGNOSIS",
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
                            selectedType: "DIAGNOSIS",
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
            diagnosisReport: diag_result,
            failureEtcText: result.length > 0 ?  result[0] + "등 " + result.length + "건" : "",
        });

    }

    goSignin() {
        this.props.history.push("/signin");
    }

    goUrl(url) {
        this.props.history.push(url);
    }

    onReport() {
        let param = {};

        param.username = this.props.auth;
        param.gb = this.state.selectedType;
        param.content = {
            // result: this.state.selectedType === "ETC" ? this.state.failureEtcText : this.state.diagnosisErrors[0] + "등 " + this.state.diagnosisErrors.length + "건",
            result: this.state.failureEtcText,
            detail: this.state.diagnosisReport
        };
        param.status = "APPLY";

        console.log(this.state.selectedType, JSON.stringify(param));

        if(this.state.selectedType) {
            //
            window.ipcRenderer.sendSync("failure-apply", param);
        } else {
            // window.ipcRenderer.sendSync("failure-apply", param);
        }

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
                        <Button block onClick={this.next.bind(this, "CONNECT")}>접속 문제</Button>
                        <Button block onClick={this.next.bind(this, "INSTALL")}>설치 문의</Button>
                        <Button block onClick={this.next.bind(this, "USAGE")}>사용 문의</Button>
                        <Button block onClick={this.next.bind(this, "ETC")}>기타 문의</Button>
                    </div>
                ),
            },
            {
                title: '세부 유형 선택',
                content: (
                    <div className={styles.inner}>
                        {
                            this.state.failureDetailType.map((detailType) => {
                                return detailType;
                            })
                        }
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
