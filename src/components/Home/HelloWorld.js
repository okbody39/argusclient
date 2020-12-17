// Libs
import React, { Component } from "react";
import {
    Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
    Upload, Icon, message, Alert, Typography, Spin,
    Modal, notification, Popconfirm,
} from 'antd';
const { Text } = Typography;
const { Dragger } = Upload;
// const { Meta } = Card;
import LoadingOverlay from 'react-loading-overlay';
import BounceLoader from 'react-spinners/BounceLoader'
import PuffLoader from 'react-spinners/PuffLoader'

import { withRouter } from 'react-router-dom';
// import FileBrowser from 'react-keyed-file-browser';
// import { Plus } from 'react-feather';

import { Caption, Figure, Image, SubTitle, Title } from '../@shared/Tile';

// import win1 from '@/assets/images/preview/windows_1.png';
// import win2 from '@/assets/images/preview/windows_2.png';
// import win3 from '@/assets/images/preview/windows_3.png';

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

// var _TIMER_ = null;

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
            visible: false,
            fileUploadervisible: false,
            fileList: [],

            connectLoading: false,
            loading: false,
            vmName: 'W10-INETRNETVM',
            selectedVm:{},
            vmlist: [],
            vmScreenShot: [],
            isFlushed: false,
            error: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        // console.log(this.props.location.state, nextProps.location.state);

        if(nextProps.location.state === "Reset") {
            window.ipcRenderer.send("vm-list", this.props.auth);
            window.ipcRenderer.send("vm-screenshot");
            this.setState({
                loading: true,
            });
        }
    }

    componentDidMount() {

        setTimeout(() => {
            window.ipcRenderer.send("start-app");
        }, 500);

        window.ipcRenderer.on("start-app", (event, arg) => {
            if(arg === "OK") {

                window.ipcRenderer.send("vm-list", this.props.auth);
                window.ipcRenderer.send("vm-screenshot");

                this.setState({
                    loading: true,
                });

            } else if(arg === "INVALIDSESSION") {
                this.props.history.push('/signin');


            } else if(arg === "INVALIDSETTING") {
                this.props.history.push('/settings');
            }

        });

        window.ipcRenderer.on("vm-list", (event, arg) => {

            if(arg.error) {
                this.setState({
                    error: {
                        title: "서버 연결 에러",
                        message: "서버와 연결이 원활하지 않습니다. 다시 한번 시도해 주세요. - " + arg.error
                    },
                });
                this.props.history.push('/signin');
            } else {
                // arg.map((vm) => {
                //   if(vm.disk) {
                //     vm.disk = JSON.parse(vm.disk);
                //     if (vm.disk && vm.disk.length > 0) {
                //       vm.disk.sort((a, b) => {
                //         return a.DiskPath > b.DiskPath ? 1 : -1
                //       })
                //     }
                //   }
                // });

                this.setState({
                    vmlist: arg,
                    loading: false,
                });
            }


        });

        window.ipcRenderer.on("vm-connect", (event, arg) => {

            if(arg === "DONE") {

                this.setState({
                    connectLoading: false,
                });

            } else {
                this.setState({
                    connectLoading: false,
                });
            }

        });

        window.ipcRenderer.on("vm-screenshot", (event, arg) => {
            let vmScreenShot = this.state.vmScreenShot;

            // console.log(":::SCREENSHOT:::", arg.id);

            vmScreenShot[arg.id] = arg.image;

            this.setState({
                vmScreenShot: vmScreenShot,
            });
        });

        window.ipcRenderer.on("reload-sig", (event, arg) => {

            window.ipcRenderer.send("vm-screenshot");

            // console.log(arg);

            this.setState({
                // vmlist: JSON.parse(arg),
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
        window.ipcRenderer.removeAllListeners('start-app');
        window.ipcRenderer.removeAllListeners('vm-list');
        window.ipcRenderer.removeAllListeners('vm-screenshot');
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
        // this.state.selectedVm.state
        // this.state.selectedVm.disk.map((disk) => {
        // ((disk.Capacity - disk.FreeSpace) / disk.Capacity * 100).toFixed(1)
        // "디스크 사용량 임계치 도달 (95% 이상)"
        let selectedVmError = "";

        if(selectedVm.state != "running") {
            selectedVmError = "VM이 꺼져있습니다.";
        }

        selectedVm.disk.map((disk) => {
            let per = (disk.Capacity - disk.FreeSpace) / disk.Capacity * 100;

            if(per > 95) {
                selectedVmError = "디스크 사용량 임계치 도달 (95% 이상)";
            }

        });

        this.setState({
            selectedVm: selectedVm,
            vmName: selectedVm.displayName,
            visible: true,
            selectedVmError: selectedVmError,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    onReset = () => {
        //console.log(this.state.selectedVm);
        let result = window.ipcRenderer.sendSync("vm-reset", this.state.selectedVm.machineId);
        // alert(result);

        if(result.result) {
            notification.success({
                message: 'VM 리셋 성공',
                description:
                    '정상적으로 리셋 되었습니다.',
            });
        } else {
            notification.error({
                message: 'VM 리셋 실패',
                description:
                    '리셋에 실패하였습니다. 잠시후 다시 시도해주세요. - ' + result.error,
            });
        }

        this.setState({
            visible: false,
        });
    };

    onRestart = () => {
        //console.log(this.state.selectedVm);
        let result = window.ipcRenderer.sendSync("vm-restart", this.state.selectedVm.machineId);
        alert(result);

        this.setState({
            visible: false,
        });
    };

    onFailure = () => {
        this.props.history.push("/failure");

        this.setState({
            visible: false,
        });
    };

    onChange = () => {
        this.props.history.push("/change");

        this.setState({
            visible: false,
        });
    };

    onHistoryChange = () => {
        this.props.history.push("/history/change");

        this.setState({
            visible: false,
        });
    };

    onConnect = (vm) => {
        console.log(vm);
        window.ipcRenderer.send("vm-connect", vm);
        this.setState({
            visible: false,
            connectLoading: true,
        });
    };

    connectVM = (vm) => {
        // e.stopPropagation();
        // e.nativeEvent.stopImmediatePropagation();

        // let result = window.ipcRenderer.sendSync("vm-connect", vmName);
        // alert(result);

        window.ipcRenderer.send("vm-connect", vm);
        this.setState({
            connectLoading: true,
        });

    };

    onChangeVmName = vmName => {
        // console.log('Content change:', str);
        this.setState({ vmName });
    };

    render() {
        return (
            <LoadingOverlay
                active={this.state.connectLoading}
                spinner={ <PuffLoader size={60} color={"white"} /> }
                // text='접속중입니다... (1분 정도 소요)'
            >
            <div className={styles.helloWorld}>

                { this.state.error &&
                <Alert
                    message={this.state.error.title}
                    description={this.state.error.message}
                    type="error"
                    showIcon
                    style={{ marginBottom: 10 }}
                />
                }
                {/* <Spin spinning={this.state.connectLoading}  size="large" tip="Loading..." /> */}
                <Row gutter={[16, 16]}>

                    {
                        this.state.vmlist.map((vm, i) => {
                            return (
                                <Col key={i} lg={{span: 6}} md={{span:8}} sm={{span:12}} xs={{span:24}} >
                                    <Card
                                        bodyStyle={{padding: 0}}
                                        // hoverable
                                        style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                                        // onClick={this.showDrawer}
                                        cover={
                                            <Figure height={150} onClick={this.showDrawer.bind(this, vm)}>
                                                <Image
                                                    source={this.state.vmScreenShot[vm.id]}
                                                />
                                                <Caption className={`header`}>
                                                    <Title>{vm.displayName}</Title>
                                                    <SubTitle>{vm.basicState || "unknown"}</SubTitle>
                                                    <SubTitle>{vm.state || "unknown"}</SubTitle>
                                                </Caption>
                                            </Figure>
                                        }
                                        actions={[
                                            <div key="play-square" onClick={this.connectVM.bind(this, vm)}>
                                                <Icon type="play-square" />
                                            </div>,

                                            // <div key="play-square" onClick={this.fileUploader.bind(this, vm.id)}>
                                            //   <Icon type="cloud-upload" />
                                            // </div>,

                                            <div key="setting" onClick={this.showDrawer.bind(this, vm)}>
                                                <Icon type="setting" />
                                            </div>,
                                        ]}
                                    >
                                        {/*<Badge status="processing" color={vm.statusColor || 'gray'} />*/}
                                        {/*<Text style={{position: 'absolute'}}>{vm.basicState || "-"}</Text>*/}
                                    </Card>
                                </Col>

                            );
                        })
                    }

                    { this.state.loading ?
                    <Col lg={{span: 6}} md={{span:8}} sm={{span:12}} xs={{span:24}} >
                        <Card hoverable onClick={() => this.props.history.push("/vm/create")}>
                            <Spin spinning={this.state.loading}  size="large" tip="Loading...">
                                <div style={{height: 150, display: 'flex', justifyContent: 'center', alignItems: "center"}}>
                                </div>
                            </Spin>
                        </Card>
                    </Col>
                    : null }

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
                    { this.state.selectedVmError &&
                    <Alert message={this.state.selectedVmError} type="error" style={{marginBottom: 15}} />
                    }
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
                        <Popconfirm
                            title="데이터 소실 우려가 있습니다. 그래도 리셋하시겠습니까?"
                            onConfirm={this.onReset}
                            //onCancel={this.onClose}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" size="small">
                                리셋
                            </Button>
                        </Popconfirm>

                        <Popconfirm
                            title="데이터 소실 우려가 있습니다. 그래도 재시작하시겠습니까?"
                            onConfirm={this.onRestart}
                            //onCancel={this.onClose}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="secondary" size="small">
                                재시작
                            </Button>
                        </Popconfirm>

                        <Button type="danger" size="small" onClick={this.onFailure}>
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
                        <Button type="primary" size="small" onClick={this.onChange}>
                            변경 신청
                        </Button>
                        {/* <Button type="secondary" size="small" onClick={this.onChange}>
              사용기간 연장
            </Button> */}
                        <Button type="secondary" size="small" onClick={this.onHistoryChange}>
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
                        기본 VM 설정 <Switch defaultChecked className="mr-3"/>

                        <Button onClick={this.onConnect.bind(this, this.state.selectedVm )} type="success">
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
                </LoadingOverlay>

        );
    }
}

export default withRouter(HelloWorld);
