// Libs
import React, { Component } from "react";
import { Button, Checkbox, Form, Input, message, Row, Card } from 'antd';
import { Eye, Mail, Triangle, User } from 'react-feather';
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

  handleSubmit(event) {
    const { form } = this.props;
    event.preventDefault();

    form.validateFields((err, values)  => {
      if (!err) {

        let formData = JSON.stringify({
          code: values,
        });

        // console.log(formData);

        localStorage.setItem("ARGUS.USERTOKEN", "true");

        this.props.history.push("/");

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
        className="px-3 bg-white mh-page"
        style={{ minHeight: '100vh' }}
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

            <FormItem>
              <Button type="primary" htmlType="submit" block className="mb-3">
                로그인
              </Button>

              {form.getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true
              })(<Checkbox className="mr-2">아이디 저장</Checkbox>)}


                {/*<a className="text-xs-right">*/}
                  <Link to="/signup">
                    <small>회원 가입</small>
                  </Link>
                {/*</a>*/}

              {/*<small> | </small>*/}

              {/*<Link to="/forgot">*/}
              {/*  <a className="text-xs-right">*/}
              {/*    <small>비밀번호 찾기</small>*/}
              {/*  </a>*/}
              {/*</Link>*/}

            </FormItem>

          </Form>
        </Content>
      </Row>
    );
  }
}

export default withRouter(Form.create()(Signin));
