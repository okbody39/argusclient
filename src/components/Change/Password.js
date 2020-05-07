// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal,
  Steps, Result, Typography, notification,
  Table, Input, Form, Slider, Radio, Select, Checkbox,InputNumber,
} from 'antd';
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const { Paragraph, Text, Title } = Typography;

import Highlighter from 'react-highlight-words';

import { Plus } from 'react-feather';


// Styles
import styles from "./Password.scss";
import { withRouter } from "react-router-dom";

/**
 * Password
 *
 * @class Password
 * @extends {Component}
 */
class Password extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let param = values;
        param.username = this.props.auth;

        let result = window.ipcRenderer.sendSync("change-password", param);

        // console.log('Received values of form: ', values, result);

        if(result.result == "false") {
          this.setState({
            error: {
              title: "비밀번호 변경 에러",
              message: "비밀번호 변경에 실패하였습니다. - " + result.reason
            },
          });
        } else if(result.result == "true") {
          this.setState({
            error: null,
          });
          notification.success({
            message: '비밀번호 변경 성공',
            description:
              '정상적으로 비밀번호를 변경하였습니다. 다시 로그인 해주세요.',
          });
          this.props.history.push("/signin");
        }
      }
    });
  };

  // handleConfirmBlur = e => {
  //   const { value } = e.target;
  //   this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  // };

  // compareToFirstPassword = (rule, value, callback) => {
  //   const { form } = this.props;
  //   if (value && value !== form.getFieldValue('password')) {
  //     callback('Two passwords that you enter is inconsistent!');
  //   } else {
  //     callback();
  //   }
  // };

  // validateToNextPassword = (rule, value, callback) => {
  //   const { form } = this.props;
  //   if (value && this.state.confirmDirty) {
  //     form.validateFields(['confirm'], { force: true });
  //   }
  //   callback();
  // };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    // const passwordError = isFieldTouched('password') && getFieldError('password');

    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <Typography>
            <Title level={2}>비밀번호 변경</Title>
            <Divider />
            {/*<Paragraph>*/}
            {/*  In the process of internal desktop applications development, many different design specs and*/}
            {/*  implementations would be involved, which might cause designers and developers difficulties and*/}
            {/*  duplication and reduce the efficiency of development.*/}
            {/*</Paragraph>*/}
          </Typography>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>

            <Form.Item label="현재 비밀번호" hasFeedback>
              {getFieldDecorator('currentPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your password!',
                  }
                ],
              })(<Input.Password />)}
            </Form.Item>

            <Form.Item label="새로운 비밀번호" hasFeedback>
              {getFieldDecorator('newPassword', {
                rules: [
                  {
                    required: true,
                    message: 'Please your new password!',
                  }
                ],
              })(<Input.Password />)}
            </Form.Item>

            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <Button type="primary" htmlType="submit">
                비밀번호 변경
              </Button>
            </Form.Item>
          </Form>
          { this.state.error &&
            <Alert
              message={this.state.error.title}
              description={this.state.error.message}
              type="error"
              showIcon
              style={{ marginTop: 10 }}
            />
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Form.create()(Password));
