// Libs
import React, {Component, useReducer} from "react";
import { Button, Checkbox, Form, Input, message, Row, Col, Card, notification } from 'antd';
import { Eye, Mail, Triangle, User, Shield } from 'react-feather';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
const FormItem = Form.Item;
const Content = styled.div`
  max-width: 400px;
  z-index: 2;
  min-width: 300px;
`;
import LoadingOverlay from 'react-loading-overlay';
import BounceLoader from 'react-spinners/BounceLoader'
import PuffLoader from 'react-spinners/PuffLoader'

const { Meta } = Card;

// Styles
import styles from "./Signin.scss";
import logo from '@/assets/images/seedclient_logo_l.png';

/**
 * Signin
 *
 * @class Signin
 * @extends {Component}
 */
class Signin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // username: "",
            // password: "",
            loading: false,
            screen: "windows-password",
            authType: "",
            blockLogin: false,
            logofile: localStorage.getItem("ARGUS.LOGO"),
        };
    }

    componentDidMount() {
        let userToken = localStorage.getItem("ARGUS.USERTOKEN") || "{}";
        let ConnInfo = localStorage.getItem("ARGUS.CONNINFO") || "{}";
        let token = JSON.parse(userToken);
        let connInfo = JSON.parse(ConnInfo);



        this.setState({
            loading: true,
        });

        setTimeout(() => {
            // window.ipcRenderer.sendSync("logout-sync");
            window.ipcRenderer.send("login-config");
        }, 500);

        // console.log(connInfo);

        if(connInfo.serverUrl && connInfo.serverUrl.length > 0 && connInfo.serverUrl !== "undefined") {
            // console.log(connInfo);
        } else {
            this.props.history.push("/signup");
        }

        if(token.remember) {
            this.props.form.setFieldsValue({
                username: token.username,
            });

        } else {
            token = "";
        }

        localStorage.setItem("ARGUS.USERTOKEN", "");

        window.ipcRenderer.on("login-config", (event, arg) => {
            // securid-passcode
            // windows-password

            // console.log(arg);

            if(arg.result) {
                //
                localStorage.setItem("ARGUS.LOGO", arg.logofile);
                localStorage.setItem("ARGUS.TITLE", arg.owner);
                document.title = arg.owner || "";
            } else {
                //
                notification.error({
                    message: '접속 오류',
                    description: '종료 후 다시 실행해 주세요. -' + arg.error
                });
                this.setState({
                    blockLogin: true,
                    loading: false,
                });
                return;
            }

            if(arg.screen === "windows-password") {
                if(arg.authType !== "") {
                    // 설정 오류!!!
                    notification.error({
                        message: '설정 오류',
                        description: '관리자에게 문의해주세요. (2FA 설정오류)'
                    });
                    this.setState({
                        blockLogin: true,
                        loading: false,
                    });
                    return;
                }
            }

            this.setState({
                loading: false,
                screen: arg.screen,
                authType: arg.authType,
                logofile: arg.logofile,
            });

        });


    }

    componentWillUnmount() {
        window.ipcRenderer.removeAllListeners('login-config');
    }

    handleSubmit(event) {
        const { form } = this.props;
        event.preventDefault();

        form.validateFields((err, values)  => {
            if (!err) {
                let ch = "login";

                if(this.state.authType === "C-P") {
                    ch = "login-cp";
                } else if(this.state.authType === "P-C") {
                    ch = "login-pc";
                }

                if(this.state.screen === "windows-password") {
                    ch = "login";
                }

                let auth = window.ipcRenderer.sendSync(ch, values);

                if(auth.result) {
                    localStorage.setItem("ARGUS.USERTOKEN", JSON.stringify(values));
                    this.props.history.push("/home");
                } else {
                    localStorage.setItem("ARGUS.USERTOKEN", "");
                    notification.error({
                        message: '로그인 실패',
                        description: auth.error // '사용자ID 또는 비밀번호를 다시 확인해 주세요.',
                    });
                }
            }
        });
    }

    render() {
        const { form } = this.props;
        // const { getFieldDecorator } = form;

        return (
            <LoadingOverlay
                active={this.state.loading}
                spinner={ <PuffLoader size={60} color={"white"} /> }
                // text={<div style={{marginTop: 15}}>{this.state.loadingText}</div>}
            >
            <Row
                type="flex"
                align="middle"
                justify="center"
                className="px-3 bg-white mh-page signin"
                style={{ minHeight: 'calc(100vh - 30px)' }}
            >
                <Content>
                    <Row type="flex" justify="center" >
                        {/*<a className="brand mr-0">*/}
                        {/*<Link to="/">*/}
                        {/*<Triangle size={32} strokeWidth={1} />*/}
                        <img src={ this.state.logofile } className={styles.logo} onError={(e)=>{e.target.onerror = null; e.target.src=logo;}} />
                        {/*</Link>*/}
                        {/*</a>*/}
                        {/*<h5 className="mb-0 mt-3">SeedADM</h5>*/}
                        {/*<p className="text-muted">get started with our service</p>*/}
                    </Row>

                    <Form
                        layout="vertical"
                        onSubmit={this.handleSubmit.bind(this)}

                    >
                        <FormItem label="사용자 계정" style={{ marginBottom: 5 }}>
                            {form.getFieldDecorator('username', {
                                rules: [
                                    {
                                        required: true,
                                        message: '사용자 계정을 입력하세요!'
                                    }
                                ]
                            })(
                                <Input
                                    prefix={
                                        <User
                                            size={16}
                                            strokeWidth={1}
                                            style={{ color: 'rgba(0,0,0,.25)' }}
                                        />
                                    }
                                    placeholder="사용자 계정"
                                />
                            )}
                        </FormItem>

                        <FormItem label="비밀번호" style={{ marginBottom: 5 }}>
                            {form.getFieldDecorator('password', {
                                rules: [{ required: true, message: '비밀번호를 입력하세요!' }]
                            })(
                                <Input
                                    prefix={
                                        <Eye
                                            size={16}
                                            strokeWidth={1}
                                            style={{ color: 'rgba(0,0,0,.25)' }}
                                        />
                                    }
                                    type="password"
                                    placeholder="비밀번호"
                                />
                            )}
                        </FormItem>
                        {
                            this.state.authType === "" ? <div style={{ marginBottom: 16 }}></div> :
                                <FormItem label="인증코드">
                                    {form.getFieldDecorator('passcode', {
                                        rules: [{ required: true, message: '인증코드를 입력하세요!' }]
                                    })(
                                        <Input
                                            prefix={
                                                <Shield
                                                    size={16}
                                                    strokeWidth={1}
                                                    style={{ color: 'rgba(0,0,0,.25)' }}
                                                />
                                            }
                                            type="passcode"
                                            placeholder="인증코드"
                                        />
                                    )}
                                </FormItem>
                        }


                        {/*<FormItem label="도메인">*/}
                        {/*  {form.getFieldDecorator('domain', {*/}
                        {/*    rules: [{ required: true, message: '도메인을 입력하세요!' }]*/}
                        {/*  })(*/}
                        {/*    <Input*/}
                        {/*      prefix={*/}
                        {/*        <Share2*/}
                        {/*          size={16}*/}
                        {/*          strokeWidth={1}*/}
                        {/*          style={{ color: 'rgba(0,0,0,.25)' }}*/}
                        {/*        />*/}
                        {/*      }*/}
                        {/*      type="text"*/}
                        {/*      placeholder="도메인"*/}
                        {/*    />*/}
                        {/*  )}*/}
                        {/*</FormItem>*/}

                        <FormItem>
                            <Button type="primary" htmlType="submit" block className="mb-3" disabled={this.state.blockLogin}>
                                로그인
                            </Button>

                            {form.getFieldDecorator('remember', {
                                valuePropName: 'checked',
                                initialValue: true
                            })(<Checkbox className="mr-2">아이디 저장</Checkbox>)}

                            <Link to="/signup" className="mr-3">
                                <small>서버 셋팅</small>
                            </Link>

                            <Link to="/diagnosis">
                                <small>접속이 안됩니다.</small>
                            </Link>

                        </FormItem>

                    </Form>
                </Content>
            </Row>
            </LoadingOverlay>
        );
    }
}

export default withRouter(Form.create()(Signin));
