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
const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',

};

window.ipcRenderer.on("pong", (event, arg) => {
  alert("async: " + arg);
});

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
import styles from "./Admin.scss";

/**
 * HelloWorld
 *
 * @class HelloWorld
 * @extends {Component}
 */
class Admin extends Component {
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
      fileUploadervisible: false,
      fileList: [],
      loading: false, //true,
      vmName: 'W10-INETRNETVM',
      selectedVm:{},
      selectVmScreenShot: "",
      vmlist: [],
      // vmlist: [
      //   { id: "VM-002", displayName: "ADM001", basicState: "AVAILABLE", statusColor: "green", operatingSystem: "WIndows 10" },
      //   { id: "VM-003", displayName: "EMP002", basicState: "DISCONNECTED", statusColor: "orange", operatingSystem: "WIndows 7" },
      //   { id: "VM-004", displayName: "EMP003", basicState: "AVAILABLE", statusColor: "red", operatingSystem: "WIndows 10" },
      //   { id: "VM-005", displayName: "USER1", basicState: "AVAILABLE", statusColor: "steelblue", operatingSystem: "WIndows 10" },
      //   { id: "VM-006", displayName: "USER2", basicState: "AVAILABLE", operatingSystem: "WIndows 10" },
      //   { id: "VM-007", displayName: "INTERNET1", basicState: "AVAILABLE", operatingSystem: "WIndows 10" },
      //   { id: "VM-008", displayName: "INTERNET2", basicState: "AVAILABLE", operatingSystem: "WIndows 10" },
      //   { id: "VM-009", displayName: "INTERNET3", basicState: "AVAILABLE", operatingSystem: "WIndows 10" },
      //   { id: "VM-010", displayName: "INTERNET4", basicState: "AVAILABLE", operatingSystem: "WIndows 10" },
      //   { id: "VM-011", displayName: "INTERNET5", basicState: "AVAILABLE", operatingSystem: "WIndows 10" },
      // ],
      vmScreenShot: [],
      isFlushed: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // console.log(this.props.location.state, nextProps.location.state);

    if(nextProps.location.state === "Reset") {
      window.ipcRenderer.send("vm-list-reset", "all");
      this.setState({
        loading: true,
      });
    }
  }

  componentDidMount() {
    // setTimeout(() => {
    //   let result = window.ipcRenderer.sendSync("vm-list", "all");
    //   console.log(result)
    //   this.setState({
    //     vmlist: result,
    //     loading: false,
    //   });
    // }, 500);


    setTimeout(() => {
      window.ipcRenderer.send("vm-list", "all");

      this.setState({
        loading: true,
      });
    }, 500);

    /*
    _TIMER_ = setInterval(() => {
      window.ipcRenderer.send("vm-list-refresh", "mhkim");
      window.ipcRenderer.send("vm-screenshot");

      this.setState({
        loading: true,
      });
    }, 1000 * 30);
    */

    window.ipcRenderer.on("vm-list", (event, arg) => {

      // console.log(arg);

      arg.map((vm) => {
        if(vm.disk) {
          vm.disk = JSON.parse(vm.disk);
        }
        if(vm.disk && vm.disk.length > 0) {
          vm.disk.sort((a, b) => { return a.DiskPath > b.DiskPath ?  1 : -1 } )
        }
      });

      this.setState({
        vmlist: arg,
        loading: false,
      });
    });

    window.ipcRenderer.on("vm-screenshot", (event, arg) => {

      this.setState({
        selectVmScreenShot: arg,
      });
    });

    window.ipcRenderer.on("reload-sig", (event, arg) => {

      // window.ipcRenderer.send("vm-screenshot");

      this.setState({
         vmlist: JSON.parse(arg),
         loading: false,
      });

      // notification.info({
      //   message: 'VM 상태 업데이트',
      //   description:
      //     '업데이트가 완료되었습니다.',
      //   onClick: () => {
      //     // console.log('Notification Clicked!');
      //   },
      // });

      /*
      if(arg.indexOf("_EVENT_ALARM_") != -1) {
        let args = arg.split("_EVENT_ALARM_");
        let contents = args[1];

        this.setState({
        });

      } else if(arg === "_VM_STATE_LIST_") {
        window.ipcRenderer.send("vm-list-refresh", "mhkim");
        window.ipcRenderer.send("vm-screenshot");
        this.setState({
          loading: true,
        });
      }
      */
    });

  }

  componentWillUnmount() {
    // clearInterval(_TIMER_);

    window.ipcRenderer.removeAllListeners('vm-list');
    // window.ipcRenderer.removeAllListeners('vm-screenshot');
    window.ipcRenderer.removeAllListeners('pong');
    window.ipcRenderer.removeAllListeners('reload-sig');
  }

  fileUploader = (vmName) => {
    this.setState({
      vmName: vmName,
      fileUploadervisible: true,
      fileList: [],
    });
  };

  handleOk = e => {
    // console.log(e);
    // alert(JSON.stringify(this.state.fileList));
    this.setState({
      fileUploadervisible: false,
    });
  };

  handleCancel = e => {
    // console.log(e);
    this.setState({
      fileUploadervisible: false,
    });
  };

  showDrawer = (selectedVm) => {
    // console.log(selectedVm);

    window.ipcRenderer.send("vm-screenshot-admin", selectedVm.name);

    // _TIMER_ = setTimeout(() => {
    //   window.ipcRenderer.send("vm-screenshot-admin", selectedVm.name);
    // }, 10000);

    this.setState({
      selectedVm: selectedVm,
      vmName: selectedVm.displayName,
      visible: true,
    });
  };

  refreshScreenshot = () => {
    window.ipcRenderer.send("vm-screenshot-admin", this.state.selectedVm.name);
  }

  onClose = () => {
    // clearTimeout( _TIMER_ );

    this.setState({
      visible: false,
    });
  };

  onReset = () => {
    //console.log(this.state.selectedVm);
    let result = window.ipcRenderer.sendSync("vm-reset", this.state.selectedVm.machineId);
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
      <div className={styles.admin} ref={node => {
        this.container = node;
      }}>
        <Affix target={() => this.container}>
         <div style={{display:'flex', flexDirection: 'row', paddingTop: 7, paddingBottom: 8, justifyContent: 'space-between', backgroundColor: 'white' }}>
          <Col>
            <Radio.Group defaultValue="a" size="small" buttonStyle="solid">
              <Radio.Button value="a">All</Radio.Button>
              <Radio.Button value="v">VIP</Radio.Button>
              <Radio.Button value="e">Error</Radio.Button>
              <Radio.Button value="r">Running</Radio.Button>
              <Radio.Button value="n">Not Running</Radio.Button>
              <Radio.Button value="h">Hidden</Radio.Button>
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
            <Text strong style={{marginLeft: 0}}>({this.state.vmlist.length} VMs)</Text>
          </Col>
        </div>
        </Affix>
        <Row gutter={[8, 8]}>
          {
            this.state.vmlist.map((vm, i) => {
              return (
                <Col key={i} xl={{span: 2}} lg={{span: 3}} md={{span:4}} sm={{span:6}} xs={{span:6}} >

                  {/*<Badge count={5}>*/}
                    <Figure height={_NODE_HEIGHT_} onClick={this.showDrawer.bind(this, vm)} color={vm.statusColor || 'gray'} >
                      <Caption className={`header`} >
                        <Badge count={0} offset={[-3, 3]}>
                          <Title>{vm.name}</Title>
                        </Badge>
                        <SubTitle>{vm.state && vm.state.toUpperCase() || "-"}</SubTitle>
                        <Description>{vm.ipAddress || "-"}</Description>
                        <Icon type="star" theme="filled" style={{fontSize: 18, color: i === 3 || i === 1 ? 'gold': vm.statusColor || 'gray', position: 'absolute', right: 5, bottom: 5}}/>
                      </Caption>
                    </Figure>
                  {/*</Badge>*/}

                  {/*<Card*/}
                  {/*  bodyStyle={{padding: 12}}*/}
                  {/*  // hoverable*/}
                  {/*  style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}*/}
                  {/*  // onClick={this.showDrawer}*/}
                  {/*  cover={*/}
                  {/*    <Figure height={80} onClick={this.showDrawer.bind(this, vm)}>*/}
                  {/*      <Image*/}
                  {/*        source={this.state.vmScreenShot[vm.id]}*/}
                  {/*      />*/}
                  {/*      <Caption className={`header`}>*/}
                  {/*        <Text strong style={{ color: "white" }}>{vm.displayName}</Text>*/}
                  {/*        <SubTitle>{vm.operatingSystem || "Unknown"}</SubTitle>*/}
                  {/*      </Caption>*/}
                  {/*    </Figure>*/}
                  {/*  }*/}
                  {/*>*/}
                  {/*    <Badge status="processing" color={vm.statusColor || 'gray'} />*/}
                  {/*    <Text style={{position: 'absolute'}}>{vm.basicState || "-"}</Text>*/}
                  {/*</Card>*/}
                </Col>
                // <Col key={i} lg={{span: 6}} md={{span:8}} sm={{span:12}} xs={{span:24}} >
                //   <Card
                //     hoverable
                //     // style={{ width: 240 }}
                //     onClick={this.showDrawer}
                //     cover={<img alt="example" className={styles.cover} src={win7preview} />}
                //   >
                //     <Meta title={ vm.Name || vm.PoolName } description={ vm.BasicState || "공용VM" } />
                //   </Card>
                // </Col>
              );
            })
          }



          {/* <Col lg={{span: 6}} md={{span:8}} sm={{span:12}} xs={{span:24}} >
            <Figure height={240}>
              <Image
                source={win7preview}
              />
              <Caption className={`header`}>
                <Title>Grid tile</Title>
                <SubTitle>Media</SubTitle>
              </Caption>
            </Figure>
          </Col> */}

          <Col xl={{span: 2}} lg={{span: 3}} md={{span:4}} sm={{span:6}} xs={{span:6}} >
            <Figure height={_NODE_HEIGHT_} onClick={() => this.props.history.push("/vm/create")} color={'lightgray'} >
              <Spin spinning={this.state.loading}  size="small" tip="Loading...">
                <div style={{height: _NODE_HEIGHT_, display: 'flex', justifyContent: 'center', alignItems: "center"}}>
                  {this.state.loading ? null : <Plus size={60} color="gray" />}
                </div>
              </Spin>
            </Figure>
            {/*<Card hoverable onClick={() => this.props.history.push("/vm/create")}>*/}
            {/*  <Spin spinning={this.state.loading}  size="large" tip="Loading...">*/}
            {/*    <div style={{height: 78, display: 'flex', justifyContent: 'center', alignItems: "center"}}>*/}
            {/*      {this.state.loading ? null : <Plus size={100} color="lightgrey" />}*/}
            {/*    </div>*/}
            {/*  </Spin>*/}
            {/*</Card>*/}
          </Col>

        </Row>


        <Drawer
          title={
            <Text editable={{ onChange: this.onChangeVmName }}>{this.state.selectedVm.name}</Text>
          }
          width={520}
          placement="right"
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ overflow: "auto", height: "calc(100vh - 110px)" }}
        >
          <Alert message="디스크 사용량 임계치 도달 (95% 이상)" type="error" /><br/>

            <div style={{display:'flex', flexDirection: 'row'}}>
              <div style={{width: 250, height: 150, marginBottom: 15, backgroundPosition: 'center center',  backgroundSize: 'cover',  backgroundImage: 'url('+this.state.selectVmScreenShot+')'}}>
                {/* <Image source={this.state.selectVmScreenShot} /> */}
              </div>
              <Button style={{marginLeft: 5}} onClick={this.refreshScreenshot}>
                <Icon type="sync" />
              </Button>
            </div>


          <Descriptions bordered title="VM 상태" size="small" column={2}>
            <Descriptions.Item label="Status" span={2}>{(this.state.selectedVm.state || "UNKNOWN").toUpperCase()}</Descriptions.Item>
            {
              this.state.selectedVm.disk && this.state.selectedVm.disk.map((disk) => {
                return (
                  <Descriptions.Item span={2} key={disk.DiskPath} label={"Disk("+disk.DiskPath.substr(0,2)+")"}>{((disk.Capacity - disk.FreeSpace) / disk.Capacity * 100).toFixed(1)}%</Descriptions.Item>
                );
              })
            }
            <Descriptions.Item span={2} label="Uptime">{this.state.selectedVm.bootTime || "-"}</Descriptions.Item>
          </Descriptions>

          <div className={styles.btngroup}>
            <Button type="primary" size="small" onClick={this.onReset}>
              리셋
            </Button>
            <Button type="secondary" size="small">
              재시작
            </Button>
            <Button type="danger" size="small">
              장애신고
            </Button>
          </div>

          <Divider />

          <Descriptions bordered title="VM 정보" size="small" column={2}>
            <Descriptions.Item label="Host name" span={2}>{this.state.selectedVm.hostName}</Descriptions.Item>
            <Descriptions.Item label="CPU">{this.state.selectedVm.numCore} Core</Descriptions.Item>
            <Descriptions.Item label="Memory">{displaySize(this.state.selectedVm.memory * 1024 * 1024)}</Descriptions.Item>
            {
              this.state.selectedVm.disk && this.state.selectedVm.disk.map((disk) => {
                return (
                  <Descriptions.Item key={disk.DiskPath} label={"Disk("+disk.DiskPath.substr(0,2)+")"}>{displaySize(disk.Capacity)}</Descriptions.Item>
                );
              })
            }
            <Descriptions.Item label="Network" span={2}>{this.state.selectedVm.ipAddress}</Descriptions.Item>
            {/*<Descriptions.Item label="Subnet">F.F.F.F</Descriptions.Item>*/}
            <Descriptions.Item label="OS ver" span={2}>{this.state.selectedVm.fullName}</Descriptions.Item>
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

            Hidden <Switch defaultChecked className="mr-3"/>

            <Button onClick={this.onConnect} type="success">
              접속
            </Button>

            <Button onClick={this.onClose} type="primary">
              닫기
            </Button>
          </div>

        </Drawer>

        <Modal
          title={`File Upload to ${this.state.vmName}`}
          visible={this.state.fileUploadervisible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          {/* <div style={{height: 200}}> */}
          <Dragger {...props}
                   fileList={this.state.fileList}
                   onChange = {(info) => {
                     const { status } = info.file;
                     if (status !== 'uploading') {
                       // console.log(info.file, info.fileList);

                     }
                     if (status === 'done') {

                       // message.success(`${info.file.name} file uploaded successfully.`);
                     } else if (status === 'error') {
                       message.error(`${info.file.name} file upload failed.`);
                     }

                     this.setState({
                       fileList: info.fileList,
                     });
                   }}
          >
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-text">파일 업로더</p>
            <p className="ant-upload-hint">
              VM 전송을 위한 한개 또는 여러개의 파일을 업로드 합니다.
            </p>
          </Dragger>
          {/* </div> */}

          {/* <FileBrowser
            files={this.state.files}
            canFilter={false}
          /> */}

        </Modal>
      </div>
    );
  }
}

export default withRouter(Admin);