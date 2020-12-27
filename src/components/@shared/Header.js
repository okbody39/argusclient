// Libs
import React, { Component } from "react";
import { Layout, Menu, Badge, Icon, notification } from "antd";
import { Link, withRouter } from 'react-router-dom';
import { Bell, RefreshCcw, AlignJustify, Wifi, WifiOff } from 'react-feather';

const { SubMenu } = Menu;

// Styles
import styles from "./Header.scss";

import logo from "@/assets/images/seedclient_logo.png"
import { ISFULLSCREEN } from "@/config";

/**
 * Header
 *
 * @class Header
 * @extends {Component}
 */
class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedKeys: [this.props.location.pathname],
            alarmCount: 0,
            alarmList: [],
            connect: "CONNECT",
            logofile: null,
        }
    }

    componentDidMount() {

        let noti = localStorage.getItem("ARGUS.NOTIFICATION");
        let logofile = localStorage.getItem("ARGUS.LOGO");

        this.setState({
            logofile
        });

        if(noti) {

            // console.log(noti);
            noti = JSON.parse(noti);

            this.setState(noti);
        }

        window.ipcRenderer.on("connect-message", (event, arg) => {
            this.setState({
                connect: arg,
            });
        });

        window.ipcRenderer.on("notification-message", (event, arg) => {
            let alarmCount = this.state.alarmCount + 1;
            let newItem = {
                ...arg,
                created_at: new Date(),
            };

            // console.log(newItem);

            let alarmList = [newItem, ...this.state.alarmList];

            if(alarmCount > 6) {
                // alarmList
                alarmList.pop();
            }

            localStorage.setItem("ARGUS.NOTIFICATION", JSON.stringify({
                alarmCount: alarmCount,
                alarmList: alarmList,
            }));

            this.setState({
                alarmCount: alarmCount,
                alarmList: alarmList,
            });
        });

    }

    componentWillUnmount() {
        window.ipcRenderer.removeAllListeners('connect-message');
        window.ipcRenderer.removeAllListeners('notification-message');
    }

    goAlarm() {
        localStorage.setItem("ARGUS.NOTIFICATION", "{}");
        this.props.history.push("/alarm");
    }

    checkUpdate() {
        // window.api.receive("fromMain", (data) => {
        //   console.log(`Received ${data} from main process`);
        // });

        // window.api.send("check-update", "some data");
        window.ipcRenderer.send("check-update");
        // ipcRenderer.send("check-update", "");

        // console.log("check-update");
    }

    reconfiguration() {
        window.ipcRenderer.send("setting-reset");
    }

    about() {
        // window.api.receive("fromMain", (data) => {
        //   console.log(`Received ${data} from main process`);
        // });

        // window.api.send("check-update", "some data");
        window.ipcRenderer.send("about-this");
        // ipcRenderer.send("check-update", "");

        // console.log("check-update");
    }

    checkConnect() {
        let connect = window.ipcRenderer.sendSync("connect-message-sync");

        notification.config({
            placement: 'topLeft',
        });

        if(connect === "CONNECT") {
            notification.success({
                message: '서버 연결 검사',
                description: '서버와의 통신에 문제가 없습니다.',
            });
        } else {
            notification.error({
                message: '서버 연결 검사',
                description: '서버와의 통신에 문제가 있습니다.',
            });
        }
    }

    render() {

        if(ISFULLSCREEN(this.props.location.pathname)) {
            return null;
        }

        return (
            <Layout.Header className={styles.header}>
                <Link to={{
                    pathname: "/home",
                    state: ""
                }}>
                    <img className={styles.logo} src={ this.state.logofile } onError={(e)=>{e.target.onerror = null; e.target.src=logo;}} />
                </Link>

                <Menu
                    // theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={["1"]}
                    className={styles.menu}
                    selectedKeys={this.state.selectedKeys}>
                    <Menu.Item key="/history/change" >
                        <Link to="/history/change">변경관리</Link>
                    </Menu.Item>
                    <Menu.Item key="/history/failure">
                        <Link to="/history/failure">장애신고</Link>
                    </Menu.Item>
                    <Menu.Item key="/history/access">
                        <Link to="/history/access">접속이력</Link>
                    </Menu.Item>
                </Menu>

                <span className="mr-auto" />

                <Menu mode="horizontal" className={styles.menu}>


                    {/*<Menu.Item>*/}
                    {/*    <Link to={{*/}
                    {/*        pathname: "/home",*/}
                    {/*        state: "Reset"*/}
                    {/*    }}>*/}
                    {/*        <div className={styles.menusubitem}>*/}
                    {/*            <RefreshCcw size={22} strokeWidth={1} />*/}
                    {/*        </div>*/}
                    {/*    </Link>*/}
                    {/*</Menu.Item>*/}

                    <Menu.Item onClick={this.checkConnect.bind(this)}>
                        {/*<Link to={{*/}
                        {/*    pathname: "/home",*/}
                        {/*}}>*/}
                            <div className={styles.menusubitem}>
                                {this.state.connect === "CONNECT" ?
                                    <Wifi size={22} strokeWidth={1} /> : <WifiOff size={22} strokeWidth={1} color={"red"} />
                                }
                            </div>
                        {/*</Link>*/}
                    </Menu.Item>

                    <Menu.Item onClick={this.goAlarm.bind(this)}>
                        <div className={styles.menusubitem}>
                            <Badge count={this.state.alarmCount}>
                                <Bell size={22} strokeWidth={1}  />
                            </Badge>
                        </div>
                    </Menu.Item>

                    <SubMenu
                        title={
                            <div className={styles.menusubitem}>
                                <AlignJustify size={22} strokeWidth={1} />
                            </div>
                        }
                        popupClassName={styles.popup}>

                        {/*<Menu.Item  style={{width: 200}}>*/}
                        {/*  <Link to="/notice">*/}
                        {/*    <Icon type="notification" />*/}
                        {/*    <span>공지사항</span>*/}

                        {/*  </Link>*/}
                        {/*</Menu.Item>*/}
                        <Menu.Item>
                            <Link to="/alarm">
                                <Icon type="bell" />
                                <span>알림목록</span>

                            </Link>
                        </Menu.Item>

                        <Menu.Divider />

                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                  <Icon type="history" />
                                  <span>이력조회</span>
                                </span>
                            }
                            popupClassName={styles.popup}>

                            <Menu.Item>
                                <Link to="/history/change">
                                    변경이력
                                </Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to="/history/failure">
                                    장애이력
                                </Link>
                            </Menu.Item>
                            <Menu.Item>
                                <Link to="/history/access">
                                    접속이력
                                </Link>
                            </Menu.Item>
                        </SubMenu>

                        <Menu.Divider />

                        <Menu.Item>
                            <Link to="/settings">
                                <Icon type="setting" />
                                <span>설정</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item onClick={this.checkUpdate.bind(this)}>
                            <Icon type="download" />
                            <span>업데이트 확인</span>
                        </Menu.Item>
                        {/*<Menu.Item>*/}
                        {/*  <Link to="/change/password">*/}
                        {/*    <Icon type="safety-certificate" />*/}
                        {/*    <span>비밀번호 변경</span>*/}
                        {/*  </Link>*/}
                        {/*</Menu.Item>*/}

                        <Menu.Item onClick={this.about.bind(this)}>
                            <Icon type="question-circle" />
                            <span>About</span>
                        </Menu.Item>


                        <Menu.Item>
                            <Link to="/logout">
                                <Icon type="logout" />
                                <span>로그아웃</span>
                            </Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>

            </Layout.Header>
        );
    }
}

export default withRouter(Header);
