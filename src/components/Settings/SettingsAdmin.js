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
import styles from "./SettingsAdmin.scss";
import { withRouter } from "react-router-dom";

/**
 * Settings
 *
 * @class Settings
 * @extends {Component}
 */
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <div className={styles.container}>
        <div className={styles.inner}>
          <Typography>
            <Title level={2}>Settings</Title>
            <Divider />
            <Paragraph>
              In the process of internal desktop applications development, many different design specs and
              implementations would be involved, which might cause designers and developers difficulties and
              duplication and reduce the efficiency of development.
            </Paragraph>
          </Typography>
          <Form {...formItemLayout} onSubmit={this.handleSubmit}>
            <Form.Item label="Plain Text">
              <span className="ant-form-text">China</span>
            </Form.Item>
            <Form.Item label="Select" hasFeedback>
              {getFieldDecorator('select', {
                rules: [{ required: true, message: 'Please select your country!' }],
              })(
                <Select placeholder="Please select a country">
                  <Option value="china">China</Option>
                  <Option value="usa">U.S.A</Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="Select[multiple]">
              {getFieldDecorator('select-multiple', {
                rules: [
                  { required: true, message: 'Please select your favourite colors!', type: 'array' },
                ],
              })(
                <Select mode="multiple" placeholder="Please select favourite colors">
                  <Option value="red">Red</Option>
                  <Option value="green">Green</Option>
                  <Option value="blue">Blue</Option>
                </Select>,
              )}
            </Form.Item>

            <Form.Item label="InputNumber">
              {getFieldDecorator('input-number', { initialValue: 3 })(<InputNumber min={1} max={10} />)}
              <span className="ant-form-text"> machines</span>
            </Form.Item>

            <Form.Item label="Switch">
              {getFieldDecorator('switch', { valuePropName: 'checked' })(<Switch />)}
            </Form.Item>

            <Form.Item label="Slider">
              {getFieldDecorator('slider')(
                <Slider
                  marks={{
                    0: 'A',
                    20: 'B',
                    40: 'C',
                    60: 'D',
                    80: 'E',
                    100: 'F',
                  }}
                />,
              )}
            </Form.Item>

            <Form.Item label="Radio.Group">
              {getFieldDecorator('radio-group')(
                <Radio.Group>
                  <Radio value="a">item 1</Radio>
                  <Radio value="b">item 2</Radio>
                  <Radio value="c">item 3</Radio>
                </Radio.Group>,
              )}
            </Form.Item>

            <Form.Item label="Radio.Button">
              {getFieldDecorator('radio-button')(
                <Radio.Group>
                  <Radio.Button value="a">item 1</Radio.Button>
                  <Radio.Button value="b">item 2</Radio.Button>
                  <Radio.Button value="c">item 3</Radio.Button>
                </Radio.Group>,
              )}
            </Form.Item>

            <Form.Item label="Checkbox.Group">
              {getFieldDecorator('checkbox-group', {
                initialValue: ['A', 'B'],
              })(
                <Checkbox.Group style={{ width: '100%' }}>
                  <Row>
                    <Col span={8}>
                      <Checkbox value="A">A</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox disabled value="B">
                        B
                      </Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="C">C</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="D">D</Checkbox>
                    </Col>
                    <Col span={8}>
                      <Checkbox value="E">E</Checkbox>
                    </Col>
                  </Row>
                </Checkbox.Group>,
              )}
            </Form.Item>
            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(Form.create()(Settings));
