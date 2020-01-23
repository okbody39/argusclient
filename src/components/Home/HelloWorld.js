// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert,
} from 'antd';

const { Dragger } = Upload;

import { Plus } from 'react-feather';

const { Meta } = Card;
const props = {
  name: 'file',
  multiple: true,
  action: 'https://',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

// Styles
import styles from "./HelloWorld.scss";

/**
 * HelloWorld
 *
 * @class HelloWorld
 * @extends {Component}
 */
class HelloWorld extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <div className={styles.helloWorld}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card
              hoverable
              // style={{ width: 240 }}
              onClick={this.showDrawer}
              cover={<img alt="example" className={styles.cover} src="https://www.samsungsvc.co.kr/proxy?isAttach=true&faqFlag=true&fileInfo=KTllLV9rTGNCS0JsMEJDLksvfERfK3kjQC5lKi9fQ0sybmVYWlwkLSE1bDN8XHwqISkzTDRNPTRra3oxLk0tKjJEM2NEKyVtXzt6XyoyIywhTio3N0BlfUROZSpFa05ea0VKMSspaj8pJm5YJmskW2tfWmNjM055OjcxNDQhJCp__B__Xmw0K19beTI6ZUw6fm4jTX1lXWtAajNNTkw__C__&fileName=1-1.gif&fromNamo=true" />}
            >
              <Meta title="W10-INTERNETVM" description="RUNNING" />
            </Card>
          </Col>
          <Col span={6}>
            <Badge count={5}>
              <Card
                hoverable
                // style={{ width: 240 }}
                onClick={this.showDrawer}
                cover={<img alt="example" className={styles.cover} src="https://www.samsungsvc.co.kr/proxy?isAttach=true&faqFlag=true&fileInfo=KTllLV9rTGNCS0JsMEJDLksvfERfK3kjQC5lKi9fQ0sybmVYWlwkLSE1bDN8XHwqISkzTDRNPTRra3oxLk0tKjJEM2NEKyVtXzt6XyoyIywhTio3N0BlfUROZSpFa05ea0VKMSspaj8pJm5YJmskW2tfWmNjM055OjcxNDQhJCp__B__Xmw0K19beTI6ZUw6fm4jTX1lXWtAajNNTkw__C__&fileName=1-1.gif&fromNamo=true" />}
              >
                <Meta title="W10-INTERNETVM" description="RUNNING" />
              </Card>
            </Badge>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              // style={{ width: 240 }}
              onClick={this.showDrawer}
              cover={<img alt="example" className={styles.cover} src="https://www.samsungsvc.co.kr/proxy?isAttach=true&faqFlag=true&fileInfo=KTllLV9rTGNCS0JsMEJDLksvfERfK3kjQC5lKi9fQ0sybmVYWlwkLSE1bDN8XHwqISkzTDRNPTRra3oxLk0tKjJEM2NEKyVtXzt6XyoyIywhTio3N0BlfUROZSpFa05ea0VKMSspaj8pJm5YJmskW2tfWmNjM055OjcxNDQhJCp__B__Xmw0K19beTI6ZUw6fm4jTX1lXWtAajNNTkw__C__&fileName=1-1.gif&fromNamo=true" />}
            >
              <Meta title="W10-INTERNETVM" description="RUNNING" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              // style={{ width: 240 }}
              onClick={this.showDrawer}
              cover={<img alt="example" className={styles.cover} src="https://www.samsungsvc.co.kr/proxy?isAttach=true&faqFlag=true&fileInfo=KTllLV9rTGNCS0JsMEJDLksvfERfK3kjQC5lKi9fQ0sybmVYWlwkLSE1bDN8XHwqISkzTDRNPTRra3oxLk0tKjJEM2NEKyVtXzt6XyoyIywhTio3N0BlfUROZSpFa05ea0VKMSspaj8pJm5YJmskW2tfWmNjM055OjcxNDQhJCp__B__Xmw0K19beTI6ZUw6fm4jTX1lXWtAajNNTkw__C__&fileName=1-1.gif&fromNamo=true" />}
            >
              <Meta title="W10-INTERNETVM" description="RUNNING" />
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card
              hoverable
              // style={{ width: 240 }}
              onClick={this.showDrawer}
              cover={<img alt="example" className={styles.cover} src="https://www.samsungsvc.co.kr/proxy?isAttach=true&faqFlag=true&fileInfo=KTllLV9rTGNCS0JsMEJDLksvfERfK3kjQC5lKi9fQ0sybmVYWlwkLSE1bDN8XHwqISkzTDRNPTRra3oxLk0tKjJEM2NEKyVtXzt6XyoyIywhTio3N0BlfUROZSpFa05ea0VKMSspaj8pJm5YJmskW2tfWmNjM055OjcxNDQhJCp__B__Xmw0K19beTI6ZUw6fm4jTX1lXWtAajNNTkw__C__&fileName=1-1.gif&fromNamo=true" />}
            >
              <Meta title="W10-INTERNETVM" description="RUNNING" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              // style={{ width: 240 }}
              onClick={this.showDrawer}
              cover={<img alt="example" className={styles.cover} src="https://www.samsungsvc.co.kr/proxy?isAttach=true&faqFlag=true&fileInfo=KTllLV9rTGNCS0JsMEJDLksvfERfK3kjQC5lKi9fQ0sybmVYWlwkLSE1bDN8XHwqISkzTDRNPTRra3oxLk0tKjJEM2NEKyVtXzt6XyoyIywhTio3N0BlfUROZSpFa05ea0VKMSspaj8pJm5YJmskW2tfWmNjM055OjcxNDQhJCp__B__Xmw0K19beTI6ZUw6fm4jTX1lXWtAajNNTkw__C__&fileName=1-1.gif&fromNamo=true" />}
            >
              <Meta title="W10-INTERNETVM" description="RUNNING" />
            </Card>
          </Col>

          <Col span={6}>
            <Card
              hoverable
              // style={{ width: 240 }}
              onClick={this.showDrawer}
              cover={<img alt="example" className={styles.cover} src="https://www.samsungsvc.co.kr/proxy?isAttach=true&faqFlag=true&fileInfo=KTllLV9rTGNCS0JsMEJDLksvfERfK3kjQC5lKi9fQ0sybmVYWlwkLSE1bDN8XHwqISkzTDRNPTRra3oxLk0tKjJEM2NEKyVtXzt6XyoyIywhTio3N0BlfUROZSpFa05ea0VKMSspaj8pJm5YJmskW2tfWmNjM055OjcxNDQhJCp__B__Xmw0K19beTI6ZUw6fm4jTX1lXWtAajNNTkw__C__&fileName=1-1.gif&fromNamo=true" />}
            >
              <Meta title="W10-INTERNETVM" description="RUNNING" />
            </Card>
          </Col>
          <Col span={6}>
            <Card
              hoverable
              // style={{ width: 240 }}
              onClick={this.showDrawer}
              cover={<img alt="example" className={styles.cover} src="http://techg.kr/wp-content/uploads/2015/06/windows10.jpg" />}
            >
              <Meta title="W10-DBVM" description="STOPPED" />
            </Card>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card hoverable>
              <div style={{height: 195, display: 'flex', justifyContent: 'center', alignItems: "center"}}>
                <Plus size={100} color="lightgrey" />
              </div>
            </Card>
          </Col>

        </Row>


        <Drawer
          title="W10-INTERNETVM"
          width={520}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Alert message="에러발생... CPU" type="error" /><br/>

          <Descriptions bordered title="VM 정보" size="small" column={2}>
            <Descriptions.Item label="Host name" span={2}>W10-INTERNAMEVM</Descriptions.Item>
            <Descriptions.Item label="CPU">2 Core</Descriptions.Item>
            <Descriptions.Item label="Memory">8 GB</Descriptions.Item>
            <Descriptions.Item label="Disk (OS)">200 GB</Descriptions.Item>
            <Descriptions.Item label="Disk (DATA)">200 GB</Descriptions.Item>
            <Descriptions.Item label="Network" span={2}>172.18.1.123</Descriptions.Item>
            {/*<Descriptions.Item label="Subnet">F.F.F.F</Descriptions.Item>*/}
            <Descriptions.Item label="OS ver" span={2}>Windows 10, 64-bit (Build 10586) 10.0.10586</Descriptions.Item>
            <Descriptions.Item label="Config Info" span={2}>
              생성 일자: 2019. 02. 24
              <br />
              최종 변경 일자: 2019. 03. 03
              <br />
            </Descriptions.Item>
          </Descriptions>

          <div className={styles.btngroup}>
            <Button type="primary" size="small">
              자원 변경
            </Button>
            <Button type="secondary" size="small">
              변경 이력
            </Button>
          </div>

          <Divider />

          <Descriptions bordered title="VM 상태" size="small" column={2}>
            <Descriptions.Item label="Status" span={2}>RUNNING</Descriptions.Item>
            <Descriptions.Item label="CPU">15%</Descriptions.Item>
            <Descriptions.Item label="Memory">56%</Descriptions.Item>
            <Descriptions.Item label="Disk (OS)">20%</Descriptions.Item>
            <Descriptions.Item label="Disk (DATA)">15%</Descriptions.Item>
            <Descriptions.Item label="Uptime">15시간 31분</Descriptions.Item>
            {/*<Descriptions.Item label="Subnet">F.F.F.F</Descriptions.Item>*/}
          </Descriptions>

          <div className={styles.btngroup}>
            <Button type="danger" size="small">
              재기동
            </Button>
            <Button type="primary" size="small">
              장애신고
            </Button>
          </div>

          <Divider />

          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">파일 업로더</p>
            <p className="ant-upload-hint">
              VM 전송을 위한 한개 또는 여러개의 파일을 업로드 합니다.
            </p>
          </Dragger>

          <br />
          <br />
          <br />



          <div
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e8e8e8',
              padding: '10px 16px',
              textAlign: 'right',
              left: 0,
              background: '#fff',
              borderRadius: '0 0 4px 4px',
            }}
          >
            기본 VM 설정 <Switch defaultChecked className="mr-3"/>

            <Button onClick={this.onClose} type="secondary">
              접속
            </Button>

            <Button onClick={this.onClose} type="primary">
              닫기
            </Button>
          </div>

        </Drawer>
      </div>
    );
  }
}

export default HelloWorld;
