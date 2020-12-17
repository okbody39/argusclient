// Libs
import React, {Component, useReducer} from "react";
import { Button, Checkbox, Form, Input, message, Row, Card, notification } from 'antd';
import { Eye, Mail, Triangle, User, Share2 } from 'react-feather';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
const FormItem = Form.Item;
const Content = styled.div`
  max-width: 400px;
  z-index: 2;
  min-width: 300px;
`;

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
    };
  }

  componentDidMount() {
    let userToken = localStorage.getItem("ARGUS.USERTOKEN") || "{}";
    let ConnInfo = localStorage.getItem("ARGUS.CONNINFO") || "{}";
    let token = JSON.parse(userToken);
    let connInfo = JSON.parse(ConnInfo);

    if(connInfo.serverUrl && connInfo.serverUrl.length > 0 && connInfo.serverUrl !== "undefined") {
      // console.log(connInfo);
      window.ipcRenderer.send("logout");

    } else {
      this.props.history.push("/signup");
    }

    if(token.remember) {
      this.props.form.setFieldsValue({
        username: token.username,
      }, () => console.log('after'));

    } else {
      token = "";
    }

    localStorage.setItem("ARGUS.USERTOKEN", "");
  }

  handleSubmit(event) {
    const { form } = this.props;
    event.preventDefault();

    form.validateFields((err, values)  => {
      if (!err) {

        let auth = window.ipcRenderer.sendSync("login", values);

        if(auth) {
          localStorage.setItem("ARGUS.USERTOKEN", JSON.stringify(values));
          this.props.history.push("/");
        } else {
          localStorage.setItem("ARGUS.USERTOKEN", "");
          notification.error({
            message: '로그인 실패',
            description:
              '사용자ID 또는 비밀번호를 다시 확인해 주세요.',
          });
        }
      }
    });
  }

  render() {
    const { form } = this.props;
    // const { getFieldDecorator } = form;

    return (
      <Row
        type="flex"
        align="middle"
        justify="center"
        className="px-3 bg-white mh-page signin"
        style={{ minHeight: 'calc(100vh - 30px)' }}
      >
        <Content>
          <div className="text-center mb-0">
              {/*<a className="brand mr-0">*/}
                {/*<Link to="/">*/}
                {/*<Triangle size={32} strokeWidth={1} />*/}
                  <img src={logo} className={styles.logo}/>
                {/*</Link>*/}
              {/*</a>*/}
            {/*<h5 className="mb-0 mt-3">SeedADM</h5>*/}
            {/*<p className="text-muted">get started with our service</p>*/}
          </div>

          <Form
            layout="vertical"
            onSubmit={this.handleSubmit.bind(this)}

          >
            <FormItem label="사용자 계정">
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

            <FormItem label="비밀번호">
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
              <Button type="primary" htmlType="submit" block className="mb-3">
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
    );
  }
}

export default withRouter(Form.create()(Signin));
