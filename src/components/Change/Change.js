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
const { Paragraph, Text } = Typography;

import Highlighter from 'react-highlight-words';

import { Plus } from 'react-feather';


// Styles
import styles from "./Change.scss";
import { withRouter } from "react-router-dom";




/**
 * Change
 *
 * @class Change
 * @extends {Component}
 */
class Change extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  goStep(current) {
    this.setState({ current });
  }

  render() {
    const { current } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const steps = [
      {
        title: '유형 선택',
        content: (
          <div className={styles.inner}>
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Button block onClick={this.next.bind(this)} style={{height: 100}}>자원 증설 신청</Button>
              </Col>
              <Col span={6}>
                <Button block onClick={this.next.bind(this)} style={{height: 100}}>OS 재설치 신청</Button>
              </Col>
              <Col span={6}>
                <Button block onClick={this.next.bind(this)} style={{height: 100}}>인수인계 신청</Button>
              </Col>
              <Col span={6}>
                <Button block onClick={this.next.bind(this)} style={{height: 100}}>사용기간 연장</Button>
              </Col>
              <Col span={6}>
                <Button block onClick={this.next.bind(this)} style={{height: 100}}>반납 신청</Button>
              </Col>
              <Col span={6}>
                <Button block onClick={this.next.bind(this)} style={{height: 100}}>백업 신청</Button>
              </Col>
              <Col span={6}>
                <Button block onClick={this.next.bind(this)} style={{height: 100}}>보안 예외 신청</Button>
              </Col>
            </Row>
            {/*<Button block>사용기간 연장</Button>*/}
            {/*<Button block>반납 신청</Button>*/}
            {/*<Button block>백업 신청</Button>*/}
            {/*<Button block>보안 예외 신청</Button>*/}
            {/*<Button block>USB 사용 권한 신청</Button>*/}
            {/*<Button block>Printer 사용 권한 신청</Button>*/}
          </div>
        ),
      },
      {
        title: '신청 정보 입력',
        content: (
          <div className={styles.inner}>
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
        ),
      },
      {
        title: '신청 정보 전송',
        content: (
          <Result
            status="success"
            title="신청이 완료 되었습니다."
            subTitle="1시간후에 적용될 예정이오니, 확인해주시기 바랍니다."
            extra={[
              // <Button type="primary" key="console">
              //   재기동
              // </Button>,
              <Button key="buy">확인</Button>,
            ]}
          >
            {/*<div className="desc">*/}
            {/*  <Paragraph>*/}
            {/*    <Text*/}
            {/*      strong*/}
            {/*      style={{*/}
            {/*        fontSize: 16,*/}
            {/*      }}*/}
            {/*    >*/}
            {/*      The content you submitted has the following error:*/}
            {/*    </Text>*/}
            {/*  </Paragraph>*/}
            {/*  <Paragraph>*/}
            {/*    <Icon style={{ color: 'red' }} type="close-circle" /> Your account has been frozen*/}
            {/*    <a>Thaw immediately &gt;</a>*/}
            {/*  </Paragraph>*/}
            {/*  <Paragraph>*/}
            {/*    <Icon style={{ color: 'red' }} type="close-circle" /> Your account is not yet eligible to*/}
            {/*    apply <a>Apply Unlock &gt;</a>*/}
            {/*  </Paragraph>*/}
            {/*</div>*/}
          </Result>
        ),
      },
    ];

    return (
      <div className={styles.container}>
        <Steps current={current} onChange={this.goStep.bind(this)}>
          {steps.map(item => (
            <Step key={item.title} title={item.title}/>
          ))}
        </Steps>
        <div>{steps[current].content}</div>
        {/*<div className="steps-action">*/}
        {/*  {current < steps.length - 1 && (*/}
        {/*    <Button type="primary" onClick={() => this.next()}>*/}
        {/*      Next*/}
        {/*    </Button>*/}
        {/*  )}*/}
        {/*  {current === steps.length - 1 && (*/}
        {/*    <Button type="primary" onClick={() => message.success('Processing complete!')}>*/}
        {/*      Done*/}
        {/*    </Button>*/}
        {/*  )}*/}
        {/*  {current > 0 && (*/}
        {/*    <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>*/}
        {/*      Previous*/}
        {/*    </Button>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default withRouter(Form.create()(Change));
