// Libs
import React, { Component } from "react";
import { Button, Checkbox, Form, Input, message, Row, Card, notification } from 'antd';
import { Eye, Mail, Triangle, User, Server } from 'react-feather';
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
import styles from "./Signup.scss";

import logo from '@/assets/images/argusclient-logo.png';

/**
 * Signup
 *
 * @class Signup
 * @extends {Component}
 */
class Signup extends Component {
    constructor(props) {
        super(props);

        let ConnInfo = localStorage.getItem("ARGUS.CONNINFO") || "{}";
        let connInfo = JSON.parse(ConnInfo);

        this.state = {
            // username: "",
            // password: "",
            loading: false,
            serverUrl: connInfo.serverUrl,
            logofile: localStorage.getItem("ARGUS.LOGO") || logo,
        };

        // this.history = useHistory();
    }

    componentDidMount() {
        const { form } = this.props;

        // window.ipcRenderer.on("setting-update", (event, arg) => {
        //   if(arg) {
        //     let value = arg; // { serverUrl: form.getFieldValue("serverUrl") };
        //
        //     // console.log("ipc", value);
        //
        //     localStorage.setItem("ARGUS.CONNINFO", JSON.stringify(value));
        //     this.props.history.push('/');
        //
        //   } else {
        //     notification.error({
        //       message: '서버설정 실패',
        //       description:
        //         '서버 정보를 다시 확인해 주세요.',
        //     });
        //   }
        //   this.setState({
        //     loading: false,
        //   });
        //
        // });

    }

    componentWillUnmount() {
        // console.log("UNMOUNT");
        // window.ipcRenderer.removeAllListeners('setting-update');
    }

    handleSubmit(event) {
        const { form } = this.props;

        event.preventDefault();

        form.validateFields((err, values)  => {
            if (!err) {

                // let formData = JSON.stringify({
                //   code: values,
                // });

                // console.log(formData);
                // this.props.history.push('/signin');

                this.setState({
                    loading: true,
                });

                // console.log("submit", values);

                // ipcRenderer.send('setting-update', values);

                let arg = ipcRenderer.sendSync('setting-update-sync', values);

                this.setState({
                    loading: false,
                });

                if(arg) {
                    let value = arg;

                    // console.log(value);

                    localStorage.setItem("ARGUS.CONNINFO", JSON.stringify(value));
                    this.props.history.push('/');

                } else {
                    notification.error({
                        message: '서버설정 실패',
                        description:
                            '서버 정보를 다시 확인해 주세요.',
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
                    className="px-3 bg-white mh-page"
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
                            {/*<p className="text-muted">get started with our service</p>*/}
                        </Row>

                        <Form
                            layout="vertical"
                            onSubmit={this.handleSubmit.bind(this)}

                        >
                            <FormItem label="서버 주소">
                                {form.getFieldDecorator('serverUrl', {
                                    initialValue: this.state.serverUrl,
                                    rules: [
                                        {
                                            required: true,
                                            message: '서버 주소을 입력하세요!'
                                        },
                                        // {
                                        //   type: 'url',
                                        //   message: '서버 주소 형식에 맞지 않습니다.'
                                        // }
                                    ]
                                })(
                                    <Input
                                        prefix={
                                            <Server
                                                size={16}
                                                strokeWidth={1}
                                                style={{ color: 'rgba(0,0,0,.25)' }}
                                            />
                                        }
                                        placeholder="127.0.0.1:8080"
                                    />
                                )}
                            </FormItem>

                            <FormItem>
                                <Button type="primary" htmlType="submit" block className="mb-3" loading={this.state.loading}>
                                    저장
                                </Button>
                            </FormItem>

                        </Form>
                    </Content>
                </Row>
            </LoadingOverlay>
        );
    }
}

export default withRouter(Form.create()(Signup));
