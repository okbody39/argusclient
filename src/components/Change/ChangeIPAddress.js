// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal,
  Steps, Result, Typography,
  Table, Input, Form, Slider, Radio, Select, Checkbox, InputNumber, notification,
} from 'antd';
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const { Paragraph, Text } = Typography;

import Highlighter from 'react-highlight-words';
import { Plus } from 'react-feather';
import { withRouter } from "react-router-dom";

// Styles
import styles from "./Change.scss";

class ChangeIPAddress extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      vmList: [],
      selectedVm: {},
    };
  }

  componentDidMount() {
    const { form } = this.props;

    setTimeout(() => {
      window.ipcRenderer.send("vm-list", this.props.auth);
    }, 500);

    window.ipcRenderer.on("vm-list", (event, arg) => {
      let selectedVm = {};

      if(Array.isArray(arg)) {
        selectedVm = arg[0];
      }

      form.setFieldsValue({
        vmId: selectedVm.id,
        cpu: parseInt(selectedVm.numCore),
        memory: selectedVm.memory / 1024,

      });

      this.setState({
        vmList: arg,
        selectdVm: selectedVm,
        loading: false,
      });

    });

  }

  componentWillUnmount() {
    window.ipcRenderer.removeAllListeners('vm-list');
  }

  changeSelectedVm() {
    const { form } = this.props;
    let selectedVm = {};
    let vmId= form.getFieldValue("vmId");

    this.state.vmList.map((vm) => {
      if(vm.vmId === vmId) {
        selectedVm = vm;

        form.setFieldsValue({
          vmId: selectedVm.id,
          cpu: parseInt(selectedVm.numCore),
          memory: selectedVm.memory / 1024,
        });
      }
    });

  }

  handleSubmit(event) {
    const { form } = this.props;

    event.preventDefault();

    form.validateFields((err, values)  => {
      if (!err) {
        console.log(values);
        this.props.setResult(values);
      }
    });
  }

  render() {
    const { current } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    return (
      <Form {...formItemLayout} onSubmit={this.handleSubmit.bind(this)}>
        {/*<Form.Item label="Plain Text">*/}
        {/*  <span className="ant-form-text">China</span>*/}
        {/*</Form.Item>*/}
        <Form.Item label="대상VM" hasFeedback>
          {getFieldDecorator('vmId', {
            // initialValue: this.state.selectdVm.numCore || 1,
            rules: [{ required: true, message: '대상 VM을 선택하세요!' }],
          })(
            <Select placeholder="대상 VM 선택" onChange={this.changeSelectedVm.bind(this)}>
              {
                this.state.vmList.map((v) => {
                  return (
                    <Option key={v.id} value={v.id}>{v.displayName}</Option>
                  )
                })
              }
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="IP 주소">
          {getFieldDecorator('ipaddress', {
            rules: [
              { 
                required: true, 
                message: 'IP주소를 입력하세요.', 
                // type: 'array' 
              },
              // {
              //   type: "regexp",
              //   pattern: new RegExp(/^(?!\.)((^|\.)([1-9]?\d|1\d\d|2(5[0-5]|[0-4]\d))){4}$/),
              //   message: 'IP주소 형식이 맞지 않습니다.', 
              // },
            ],
          })(
            <Input placeholder="xxx.xxx.xxx.xxx" />
          )}
        </Form.Item>

        {/* <Form.Item label="Select[multiple]">
          {getFieldDecorator('select-multiple', {
            rules: [
              // { required: true, message: 'Please select your favourite colors!', type: 'array' },
            ],
          })(
            <Select mode="multiple" placeholder="Please select favourite colors">
              <Option value="red">Red</Option>
              <Option value="green">Green</Option>
              <Option value="blue">Blue</Option>
            </Select>,
          )}
        </Form.Item>

        <Form.Item label="Switch">
          {getFieldDecorator('switch', { valuePropName: 'checked' })(<Switch />)}
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
        </Form.Item> */}

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(ChangeIPAddress);
