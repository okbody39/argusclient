// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Typography, Spin,
  Modal, notification, Radio, Input, Select, Affix,
} from 'antd';
const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;
const { Meta } = Card;
const { Option } = Select;

import { Link, withRouter } from 'react-router-dom';
import FileBrowser from 'react-keyed-file-browser';
import { Plus } from 'react-feather';

import { Caption, Figure, SubTitle, Title, Description, Image } from '../@shared/TileAdmin';

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
      clientList: [],
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
      let list = [];

      arg.map((c) => {
        let cjson = JSON.parse(c);
        let client =  JSON.parse(cjson.result);

        client.statusColor = cjson.status === "CONNECT" ? "green" : "gray"; 
        client.id = cjson.user;
        client.state = cjson.status;
        client.displayName = cjson.user;
        client.version = cjson.version;

        let nics = [];
        client.nics.map((nic) => {
          nics.push(nic.address + " (" + nic.mac + ")");
        });

        client.nics = nics.join("<br/>");

        list.push(client);

      });

      this.setState({
        clientList: list,
        loading: false,
      });
    });

    // window.ipcRenderer.on("reload-sig", (event, arg) => {
    //   this.setState({
    //     // clientList: JSON.parse(arg),
    //     loading: false,
    //   });
    // });
  }

  componentWillUnmount() {
    window.ipcRenderer.removeAllListeners('client-list');
    // window.ipcRenderer.removeAllListeners('reload-sig');
  }

  showDrawer = (selectedClient) => {
    selectedClient.vms = window.ipcRenderer.sendSync("vm-list-admin", selectedClient.id);

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
                <Option value="b">Version</Option>
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
                      <Description>{vm.version || "-"}</Description>
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
            <Text >{this.state.selectedClient.displayName}</Text>
          }
          width={520}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ overflow: "auto", height: "calc(100vh - 110px)" }}
        >
          <Descriptions bordered title="Client 상태" size="small" column={2}>
            <Descriptions.Item label="Status" span={2}>{(this.state.selectedClient.state || "UNKNOWN").toUpperCase()}</Descriptions.Item>
            <Descriptions.Item span={2} label="Version">{this.state.selectedClient.version || "-"}</Descriptions.Item>
            <Descriptions.Item span={2} label="Horizon Client">{this.state.selectedClient.vhc || "-"}</Descriptions.Item>
          </Descriptions>

          <div className={styles.btngroup}>
            <Button type="secondary" size="small">
              업데이트
            </Button>
            <Button type="danger" size="small">
              접속차단
            </Button>
          </div>

          <Divider />

          <Descriptions bordered title="VM" size="small" column={2}>
            {
              (this.state.selectedClient.vms||[]).map((vm) => {
                return (
                  <Descriptions.Item key={vm.id} label={vm.displayName} span={2}>
                    <Badge status="processing" color={vm.statusColor || 'gray'} /> {vm.basicState}
                    <Button type="link" size="small" style={{marginLeft: 10}}>
                      Reboot
                    </Button>
                  </Descriptions.Item>
                )
              })
            }
          </Descriptions>

          <Divider />

          <Descriptions bordered title="접속환경" size="small" column={2}>
            <Descriptions.Item label="Host name" span={2}>{this.state.selectedClient.hostname}</Descriptions.Item>
            <Descriptions.Item label="CPU" span={2}>{this.state.selectedClient.cpus} Core</Descriptions.Item>
            <Descriptions.Item label="Memory" span={2}>{displaySize(this.state.selectedClient.totalmem)}</Descriptions.Item>
            <Descriptions.Item label="Network" span={2}>{ this.state.selectedClient.nics }</Descriptions.Item>
            <Descriptions.Item label="OS ver" span={2}>{this.state.selectedClient.os}</Descriptions.Item>
          </Descriptions>

          <Divider />

          <TextArea rows={4} />

          <div className={styles.btngroup}>
            <Button type="primary" size="small">
              메세지 전송
            </Button>
          </div>

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
