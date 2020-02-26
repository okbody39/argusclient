// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Typography,
} from 'antd';
const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { Meta } = Card;
import { Link, withRouter } from 'react-router-dom';
import FileBrowser from 'react-keyed-file-browser';

import { Plus } from 'react-feather';

import win7preview from '@/assets/images/preview/windows7.gif';


const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
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

window.ipcRenderer.on("pong", (event, arg) => {
  alert("async: " + arg);
});

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
      files: [
        {
          key: 'cat.png',
          modified: new Date(),
          size: 1.5 * 1024 * 1024,
        },
        {
          key: 'kitten.png',
          modified: new Date(),
          size: 545 * 1024,
        },
        {
          key: 'elephant.png',
          modified: new Date(),
          size: 52 * 1024,
        },
      ],
      visible: false,
      vmName: 'W10-INETRNETVM',
      vmlist: props.vmlist,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      let result = window.ipcRenderer.sendSync("vm-list", "all");
      console.log(result)
      this.setState({
        vmlist: result,
      });
    }, 500);

  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onReset = () => {
    let result = window.ipcRenderer.sendSync("vm-reset", "WIN10-INTERNETVM");
    alert(result);

    this.setState({
      visible: false,
    });
  };

  onConnect = () => {
    window.ipcRenderer.send("ping", "What's up?");
    this.setState({
      visible: false,
    });
  };

  connectVM = (vmName) => {
    // e.stopPropagation();
    // e.nativeEvent.stopImmediatePropagation();

    let result = window.ipcRenderer.sendSync("vm-connect", vmName);
    alert(result);
  };

  onChangeVmName = vmName => {
    // console.log('Content change:', str);
    this.setState({ vmName });
  };

  render() {
    return (
      <div className={styles.helloWorld}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card
              bodyStyle={{padding: 12}}
              cover={
                <>
                  <div style={{
                    // backgroundColor: 'rgba(255,255,255,0.5)',
                    position: 'absolute', top: 40, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      backgroundColor: 'rgba(255,255,255,0.7)',
                    }}>
                      <Text strong>W10-INTERNETVM</Text>
                    </div>
                  </div>
                  <img className={styles.cover}
                       src={win7preview} />
                </>
              }
              actions={[
                <div key="play-square" onClick={this.connectVM.bind(this, 'WIN10-INTERNETVM')}>
                  <Icon type="play-square" /> 접속
                </div>,
                <div key="setting" onClick={this.showDrawer}>
                  <Icon type="setting" /> 정보
                </div>,
              ]}
            >
              <Badge status="processing" text="RUNNING" />

              {/*<Meta title="W10-INTERNETVM"*/}
              {/*      description={<Badge status="processing" text="RUNNING" />}*/}
              {/*/>*/}
            </Card>
          </Col>
          <Col span={6}>
            <Badge count={1}>
              <Card
                bodyStyle={{padding: 12}}
                cover={
                  <>
                    <div style={{
                      // backgroundColor: 'rgba(255,255,255,0.5)',
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center',
                      textAlign: 'center'
                    }}>
                      <div style={{
                        borderRadius: 20,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        padding: 5,
                        margin: 10,
                      }}>
                        <Text strong>W10-INTERNETVM</Text>
                      </div>
                    </div>
                    <img className={styles.cover}
                         src={win7preview} />
                  </>
                }
                actions={[
                  <div key="play-square" onClick={this.connectVM.bind(this, 'WIN10-INTERNETVM')}>
                    <Icon type="play-square" /> 접속
                  </div>,
                  <div key="setting" onClick={this.showDrawer}>
                    <Icon type="setting" /> 정보
                  </div>,
                ]}
              >
                <Badge status="processing" text="RUNNING" />

                {/*<Meta title="W10-INTERNETVM"*/}
                {/*      description={<Badge status="processing" text="RUNNING" />}*/}
                {/*/>*/}
              </Card>
            </Badge>
          </Col>
          <Col span={6}>
            <Card
              // hoverable
              // style={{ width: 240 }}
              // onClick={this.showDrawer}
              cover={
                <a href="#" onClick={this.connectVM.bind(this, 'WIN10-INTERNETVM')}>
                  <img alt="example" className={styles.cover}
                       src={win7preview} />
                </a>
               }
            >
              <Meta title={
                      <a href="#" onClick={this.showDrawer}>
                        <Text strong>W10-INTERNETVM</Text>
                      </a>
                    }
                    description={
                      <Badge status="processing" text="RUNNING" />
                    }  />

            </Card>
          </Col>

          {
            this.state.vmlist.map((vm, i) => {
              return (
                <Col key={i} span={6}>
                  <Card
                    hoverable
                    // style={{ width: 240 }}
                    onClick={this.showDrawer}
                    cover={<img alt="example" className={styles.cover} src={win7preview} />}
                  >
                    <Meta title={vm.Name} description={vm.BasicState} />
                  </Card>
                </Col>
              );
            })
          }

          <Col span={6}>
            <Card hoverable onClick={() => this.props.history.push("/vm/create")}>
              <div style={{height: 195, display: 'flex', justifyContent: 'center', alignItems: "center"}}>
                <Plus size={100} color="lightgrey" />
              </div>
            </Card>
          </Col>

        </Row>


        <Drawer
          title={
            <Text editable={{ onChange: this.onChangeVmName }}>{this.state.vmName}</Text>
          }
          width={520}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ overflow: "auto", height: "calc(100vh - 110px)" }}
        >
          <Alert message="메모리 사용량 임계치 도달 (95% 이상)" type="error" /><br/>

          <Descriptions bordered title="VM 상태" size="small" column={2}>
            <Descriptions.Item label="Status" span={2}>RUNNING</Descriptions.Item>
            <Descriptions.Item label="CPU">15%</Descriptions.Item>
            <Descriptions.Item label="Memory">56%</Descriptions.Item>
            <Descriptions.Item label="Disk (OS)">20%</Descriptions.Item>
            <Descriptions.Item label="Disk (DATA)">15%</Descriptions.Item>
            <Descriptions.Item label="Uptime">15시간 31분</Descriptions.Item>
            <Descriptions.Item label="마지막 접속">2020년 01월 26일</Descriptions.Item>
          </Descriptions>

          <div className={styles.btngroup}>
            <Button type="primary" size="small" onClick={this.onReset}>
              리셋
            </Button>
            <Button type="secondary" size="small">
              전원켜기
            </Button>
            <Button type="danger" size="small">
              장애신고
            </Button>
          </div>

          <Divider />

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
              반납 일자: 2020. 03. 03
              <br />
            </Descriptions.Item>
          </Descriptions>

          <div className={styles.btngroup}>
            <Button type="primary" size="small">
              용량 증설
            </Button>
            <Button type="secondary" size="small">
              사용기간 연장
            </Button>
            <Button type="secondary" size="small">
              변경 이력
            </Button>
          </div>

          <Divider />
          <div style={{height: 200}}>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <Icon type="inbox" />
              </p>
              <p className="ant-upload-text">파일 업로더</p>
              <p className="ant-upload-hint">
                VM 전송을 위한 한개 또는 여러개의 파일을 업로드 합니다.
              </p>
            </Dragger>
          </div>

          <FileBrowser
            files={this.state.files}
            canFilter={false}
          />

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

            <Button onClick={this.onConnect} type="danger" style={{width: 100}}>
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

export default withRouter(HelloWorld);
