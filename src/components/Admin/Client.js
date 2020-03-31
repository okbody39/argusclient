// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Typography, Spin,
  Modal, notification, Radio, Input, Select, Affix,
} from 'antd';
const { Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { Meta } = Card;
const { Option } = Select;

import { Link, withRouter } from 'react-router-dom';
import FileBrowser from 'react-keyed-file-browser';
import { Plus } from 'react-feather';

import { Caption, Figure, SubTitle, Title, Description, Image } from '../@shared/TileAdmin';
// import win7preview from '@/assets/images/preview/windows7.gif';

const _NODE_HEIGHT_ = 70;

const displaySize = (size) => {
  if(size) {
    let displaySize = "";
    let bytes = 0;
    if(typeof size === "number") {
      bytes = size;
    } else {
      bytes = parseInt(size)
    }

    if (bytes >= 1073741824)      { displaySize = (bytes / 1073741824).toFixed(2) + " GB"; }
    else if (bytes >= 1048576)    { displaySize = (bytes / 1048576).toFixed(2) + " MB"; }
    else if (bytes >= 1024)       { displaySize = (bytes / 1024).toFixed(2) + " KB"; }
    else if (bytes > 1)           { displaySize = bytes + " bytes"; }
    else if (bytes == 1)          { displaySize = bytes + " byte"; }
    else                          { displaySize = "0 bytes"; }

    return displaySize;

  } else {
    return "-";
  }
};

var _TIMER_ = null;

// Styles
import styles from "./Client.scss";

/**
 * Client
 *
 * @class Client
 * @extends {Component}
 */

 class Client extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      loading: false, //true,
      selectedClient:{},
      clientList: [
        { id: "EMP0001", displayName: "김사원", state: "AVAILABLE", statusColor: "green", operatingSystem: "WIndows 10" },
        { id: "EMP0002", displayName: "한임원", state: "AVAILABLE", statusColor: "gray", operatingSystem: "WIndows 10" },
        { id: "EMP0003", displayName: "강상무", state: "AVAILABLE", statusColor: "gray", operatingSystem: "WIndows 10" },
        { id: "EMP0004", displayName: "이부장", state: "AVAILABLE", statusColor: "red", operatingSystem: "WIndows 10" },
      ],
    };
  }

  componentWillReceiveProps(nextProps) {
  }

  componentDidMount() {
    setTimeout(() => {
      window.ipcRenderer.send("client-list");

      this.setState({
        loading: true,
      });

    }, 500);

    window.ipcRenderer.on("client-list", (event, arg) => {
      let list = [...this.state.clientList, {id:arg}];

      this.setState({
        clientList: list,
        loading: false,
      });
    });

    window.ipcRenderer.on("reload-sig", (event, arg) => {
      this.setState({
        clientList: JSON.parse(arg),
        loading: false,
      });
    });
  }

  componentWillUnmount() {
    window.ipcRenderer.removeAllListeners('client-list');
    window.ipcRenderer.removeAllListeners('reload-sig');
  }

  showDrawer = (selectedClient) => {
    this.setState({
      selectedClient: selectedClient,
      visible: true,
    });

  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div className={styles.admin} ref={node => {
        this.container = node;
      }}>

        <Affix target={() => this.container}>
         <div style={{display:'flex', flexDirection: 'row', paddingTop: 7, paddingBottom: 8, justifyContent: 'space-between', backgroundColor: 'white' }}>
          <Col>
            <Radio.Group defaultValue="a" size="small" buttonStyle="solid">
              <Radio.Button value="a">All</Radio.Button>
              <Radio.Button value="v">VIP</Radio.Button>
              <Radio.Button value="e">Use</Radio.Button>
              <Radio.Button value="r">Not Use</Radio.Button>
            </Radio.Group>
          </Col>
          <Col>
            <Input.Group compact>
              <Select defaultValue="a" size="small" style={{ width: 80 }}>
                <Option value="a">Name</Option>
                <Option value="b">IP</Option>
              </Select>
              <Input defaultValue=""  size="small"  style={{ width: 200 }}/>
            </Input.Group>
          </Col>
          <Col>
          </Col>
          <Col>
            <Text strong style={{marginLeft: 0}}>({this.state.clientList.length} VMs)</Text>
          </Col>
        </div>
        </Affix>

        <Row gutter={[8, 8]}>

          {
            this.state.clientList.map((vm, i) => {
              return (
                <Col key={i} xl={{span: 2}} lg={{span: 3}} md={{span:4}} sm={{span:6}} xs={{span:6}} >
                  <Figure height={_NODE_HEIGHT_} onClick={this.showDrawer.bind(this, vm)} color={vm.statusColor || 'gray'} >
                    <Caption className={`header`} >
                      <Badge count={0} offset={[-3, 3]}>
                        <Title>{vm.id}</Title>
                      </Badge>
                      <SubTitle>{vm.displayName  || "-"}</SubTitle>
                      <Description>{vm.state && vm.state.toUpperCase() || "-"}</Description>
                      <Icon type="star" theme="filled" style={{fontSize: 18, color: i === 3 || i === 1 ? 'gold': vm.statusColor || 'gray', position: 'absolute', right: 5, bottom: 5}}/>
                    </Caption>
                  </Figure>
                </Col>
              );
            })
          }

          <Col xl={{span: 2}} lg={{span: 3}} md={{span:4}} sm={{span:6}} xs={{span:6}} >
            <Figure height={_NODE_HEIGHT_} onClick={() => this.props.history.push("/vm/create")} color={'lightgray'} >
              <Spin spinning={this.state.loading}  size="small" tip="Loading...">
                <div style={{height: _NODE_HEIGHT_, display: 'flex', justifyContent: 'center', alignItems: "center"}}>
                  {this.state.loading ? null : <Plus size={60} color="gray" />}
                </div>
              </Spin>
            </Figure>
          </Col>
        </Row>

        <Drawer
          title={
            <Text >{this.state.selectedClient.name}</Text>
          }
          width={520}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ overflow: "auto", height: "calc(100vh - 110px)" }}
        >
          <Descriptions bordered title="VM 상태" size="small" column={2}>
            <Descriptions.Item label="Status" span={2}>{(this.state.selectedClient.state || "UNKNOWN").toUpperCase()}</Descriptions.Item>
            <Descriptions.Item span={2} label="Uptime">{this.state.selectedClient.bootTime || "-"}</Descriptions.Item>
          </Descriptions>

          <div className={styles.btngroup}>
            <Button type="secondary" size="small">
              재시작
            </Button>
            <Button type="danger" size="small">
              장애신고
            </Button>
          </div>

          <Divider />

          <Descriptions bordered title="VM 정보" size="small" column={2}>
            <Descriptions.Item label="Host name" span={2}>{this.state.selectedClient.hostName}</Descriptions.Item>
            <Descriptions.Item label="CPU">{this.state.selectedClient.numCore} Core</Descriptions.Item>
            <Descriptions.Item label="Memory">{displaySize(this.state.selectedClient.memory * 1024 * 1024)}</Descriptions.Item>
            \<Descriptions.Item label="Network" span={2}>{this.state.selectedClient.ipAddress}</Descriptions.Item>
            <Descriptions.Item label="OS ver" span={2}>{this.state.selectedClient.fullName}</Descriptions.Item>
          </Descriptions>

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
            VIP <Switch defaultChecked className="mr-3"/>

            <Button onClick={this.onClose} type="primary">
              닫기
            </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default withRouter(Client);
