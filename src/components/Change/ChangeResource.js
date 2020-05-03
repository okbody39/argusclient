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

class ChangeResource extends Component {
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
        // console.log(values);
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

        <Form.Item label="CPU">
          {getFieldDecorator('cpu')(
            <Slider
              min={1}
              max={6}
              marks={{
                1: '1core',
                2: '2core',
                3: '3core',
                4: '4core',
                5: '5core',
                6: '6core',
              }}
            />,
          )}
        </Form.Item>

        <Form.Item label="Memory">
          {getFieldDecorator('memory', { initialValue: 4 })(<InputNumber min={4} max={32} />)}
          <span className="ant-form-text"> Gb</span>
        </Form.Item>

        <Form.Item label="Disk">
          {getFieldDecorator('disk', { initialValue: 30 })(<InputNumber min={30} max={100} />)}
          <span className="ant-form-text"> Gb</span>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(ChangeResource);
