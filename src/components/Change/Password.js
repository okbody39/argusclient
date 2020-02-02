// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal,
  Steps, Result, Typography,
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
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  render() {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const passwordError = isFieldTouched('password') && getFieldError('password');

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

            <Form.Item label="Password" hasFeedback>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please input your password!',
                  },
                  {
                    validator: this.validateToNextPassword,
                  },
                ],
              })(<Input.Password />)}
            </Form.Item>

            <Form.Item label="Confirm Password" hasFeedback>
              {getFieldDecorator('confirm', {
                rules: [
                  {
                    required: true,
                    message: 'Please confirm your password!',
                  },
                  {
                    validator: this.compareToFirstPassword,
                  },
                ],
              })(<Input.Password onBlur={this.handleConfirmBlur} />)}
            </Form.Item>

            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <Button type="primary" htmlType="submit">
                비밀번호 변경
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(Form.create()(Password));
