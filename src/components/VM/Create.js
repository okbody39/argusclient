// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal, Avatar, Radio,
  Steps, Result, Typography,
  Table, Input,
} from 'antd';
const { Step } = Steps;
const { Paragraph, Text } = Typography;
const { Meta } = Card;
import Highlighter from 'react-highlight-words';

import { Plus } from 'react-feather';


// Styles
import styles from "./Create.scss";


// const vm_icon = {
//   "redhat" ""
//   "amazon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAACc0lEQ…lzDyhzFDS8z4Y8OwoaPWiHx3IB/z65v2Wtw5VZ4OdCtNb+X/gs3gJ6Pb3jAAAAAElFTkSuQmCC",
//   "centos": "data:image/gif;base64,R0lGODlhFQAUAPQeAMSPvfr08qlPll9em/Ty2JjNIe+iF7OyzMznj…zUBtYWEwRNB8Cd4AwGBi4G5mkRzwfRDwgKDBa3DHUzOwsqQIGxQ0aJCwUQaDNYYsHCESEAADs=",
//   "debian": "data:image/gif;base64,R0lGODlhEQAVAPQfAN4xb+ZmlOuFqfGpw/O0yuRZitcHUfjU4ffM2…kBAxcIDhBUHwcKaSsIArgTdh8AAFW/IgQGtcAsG4DFewAWySwdy80rGgECb9EiExIZXSwhADs=",
// }

import vm_windows from "@/assets/images/vm/windows_icon.png";
import vm_debian from "@/assets/images/vm/debian_icon.png";
import vm_centos from "@/assets/images/vm/centos_icon.png";
import vm_linux from "@/assets/images/vm/linux_icon.jpeg";
import vm_redhat from "@/assets/images/vm/redhat_icon.png";
import vm_suse from "@/assets/images/vm/suse_icon.png";
import vm_ubuntu from "@/assets/images/vm/ubuntu_icon.png";


/**
 * Create
 *
 * @class Create
 * @extends {Component}
 */
class Create extends Component {
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

    const steps = [
      {
        title: '유형 선택',
        content: (
          <div className={styles.inner}>
            <Radio.Group defaultValue="a" buttonStyle="solid">
              <Radio.Button value="a">All</Radio.Button>
              <Radio.Button value="w">Windows</Radio.Button>
              <Radio.Button value="l">Linux</Radio.Button>
            </Radio.Group>

            <Radio.Group defaultValue="6" buttonStyle="solid" style={{marginLeft: 10}}>
              <Radio.Button value="3">32bit</Radio.Button>
              <Radio.Button value="6">64bit</Radio.Button>
            </Radio.Group>

            <Divider />

            <Row gutter={[16, 16]}>

              <Col span={12}>
                <Card
                  hoverable
                  // onClick={this.showDrawer}
                  // cover={<div className={styles.cover}><img src={vm_ubuntu} /></div>}
                >
                  <Meta avatar={<Avatar src={vm_windows} />}
                        title="WINDOWS 10" description="64bit, SSD" />
                </Card>
              </Col>

              <Col span={12}>
                <Card
                  hoverable
                  // onClick={this.showDrawer}
                  // cover={<div className={styles.cover}><img src={vm_ubuntu} /></div>}
                >
                  <Meta avatar={<Avatar src={vm_suse} />}
                        title="SUSE Linux" description="64bit, SSD" />
                </Card>
              </Col>

              <Col span={12}>
                <Card
                  hoverable
                  // onClick={this.showDrawer}
                  // cover={<div className={styles.cover}><img src={vm_ubuntu} /></div>}
                >
                  <Meta avatar={<Avatar src={vm_centos} />}
                        title="CentOs" description="64bit, SSD" />
                </Card>
              </Col>

              <Col span={12}>
                <Card
                  hoverable
                  // onClick={this.showDrawer}
                  // cover={<div className={styles.cover}><img src={vm_ubuntu} /></div>}
                >
                  <Meta avatar={<Avatar src={vm_redhat} />}
                        title="Redhat" description="64bit, SSD" />
                </Card>
              </Col>

              <Col span={12}>
                <Card
                  hoverable
                  // onClick={this.showDrawer}
                  // cover={<div className={styles.cover}><img src={vm_ubuntu} /></div>}
                >
                  <Meta avatar={<Avatar src={vm_linux} />}
                        title="Linux" description="64bit, SSD" />
                </Card>
              </Col>

            </Row>
            {/*<Button block onClick={this.next.bind(this)}>접속 문제</Button>*/}
            {/*<Button block>설치 문의</Button>*/}
            {/*<Button block>사용 문의</Button>*/}
            {/*<Button block>기타 문의</Button>*/}
          </div>
        ),
      },
      {
        title: '자원 선택',
        content: (
          <div className={styles.inner}>
            <Button block>VM이 보이지 않습니다.</Button>
            <Button block>접속시 로딩시간이 많이 소요됩니다.</Button>
            <Button block onClick={this.next.bind(this)}>접속이 되지 않습니다.</Button>
          </div>
        ),
      },
      {
        title: '검토',
        content: (
          <Result
            // status="success"
            title="관리자 문의 필요"
            subTitle="재기동후에도 VM 접속이 안될 경우, 고장신고를 해주시기 바랍니다."
            extra={[
              <Button type="primary" key="console">
                재기동
              </Button>,
              <Button key="buy">고장신고</Button>,
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

export default Create;
