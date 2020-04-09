// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal,
  Steps, Result, Typography,
  Table, Input, Form, Slider, Radio, Select, Checkbox,InputNumber, notification,
} from 'antd';
const FormItem = Form.Item;
const { Step } = Steps;
const { Option } = Select;
const { Paragraph, Text, Title } = Typography;
import { Eye, Mail, Triangle, User, Server } from 'react-feather';
import Highlighter from 'react-highlight-words';

import { Plus } from 'react-feather';


// Styles
import styles from "./Settings.scss";
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

    let ConnInfo = localStorage.getItem("ARGUS.CONNINFO") || "{}";
    let connInfo = JSON.parse(ConnInfo);

    this.state = {
      // username: "",
      // password: "",
      loading: false,
      serverUrl: connInfo.serverUrl,
    };

    // this.history = useHistory();
  }

  componentDidMount() {
    const { form } = this.props;
    
    window.ipcRenderer.on("setting-update", (event, arg) => {
      if(arg) {
        let value = arg; // { serverUrl: form.getFieldValue("serverUrl") };

        // console.log("ipc", value);

        localStorage.setItem("ARGUS.CONNINFO", JSON.stringify(value));
        this.props.history.push('/');
        
      } else {
        notification.error({
          message: '서버설정 실패',
          description:
            '서버 정보를 다시 확인해 주세요.',
        });
      }
      this.setState({
        loading: false,
      });

    });

  }

  componentWillUnmount() {
    window.ipcRenderer.removeAllListeners('setting-update');
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

        console.log("submit", values);

        ipcRenderer.send('setting-update', values);
        
        
      }
    });
  }

  render() {
    const { form } = this.props;
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
              서버 IP가 변경된 경우가 아니면 수정하지 말아 주세요. 변경시 서비스가 정상적으로 동작하지 않을 수있습니다.
            </Paragraph>
          </Typography>
          <Form
             {...formItemLayout}
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
            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <Button type="primary" htmlType="submit" loading={this.state.loading}>
              저장
              </Button>
            </Form.Item>
            {/* <FormItem>
              <Button type="primary" htmlType="submit" block className="mb-3" loading={this.state.loading}>
                저장
              </Button>
            </FormItem> */}

          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(Form.create()(Settings));
