// Libs
import React, { Component } from "react";
import { Layout, Menu, Badge, List, Notification, Avatar, Icon } from "antd";
import { Link, withRouter } from 'react-router-dom';
import { Settings, Bell, Triangle, User } from 'react-feather';

const { SubMenu } = Menu;

// Styles
import styles from "./Header.scss";

import logo from "@/assets/images/seedclient_logo.png"
import { ISFULLSCREEN } from "@/config";

const notifications = [
  {
    title: '시스템 점검 안내',
    description: '1 hour ago',
  },
  {
    title: '설연휴 특별 이벤트',
    description: '1 hour ago',
  },
  {
    title: '2020년 시스템 변경 사항 공지',
    description: '2 hours ago',
  },
];

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
    }
  }

  render() {

    if(ISFULLSCREEN(this.props.location.pathname)) {
      return null;
    }

    return (
      <Layout.Header className={styles.header}>
        <Link to="/">
          <img className={styles.logo} src={logo}/>
        </Link>

        <Menu
          // theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          className={styles.menu}
          selectedKeys={this.state.selectedKeys}
          // onClick={(e) => this.onChangeMenu(e.key)}
        >
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

          {/*<Menu.Item onClick={() => dispatch({ type: 'options' })}>*/}
          {/*  <Settings size={20} strokeWidth={1} />*/}
          {/*</Menu.Item>*/}

          <SubMenu
            title={
              <div className={styles.menusubitem}>
              <Badge count={5}>
                  <Bell size={22} strokeWidth={1} />
              </Badge>
              </div>

            }
            popupClassName={styles.popup}
          >
            <Menu.Item
              className="p-0 bg-transparent"
              style={{ height: 'auto' }}
            >
              <List
                className="header-notifications"
                itemLayout="horizontal"
                dataSource={notifications}
                // footer={<div>5 Notifications</div>}
                renderItem={item => (
                  <div className={styles.inner}>
                    <List.Item>
                      <List.Item.Meta
                        // avatar={item.avatar}
                        title={<a>{item.title}</a>}
                        description={<small>{item.description}</small>}
                      />
                    </List.Item>
                  </div>
                )}
              />

            </Menu.Item>
          </SubMenu>

          <SubMenu
            title={
              <div className={styles.menusubitem}>
                <Settings size={22} strokeWidth={1} />
              </div>
            }
            popupClassName={styles.popup}
          >

            <Menu.Item>
              <Link to="/notice">
                <Icon type="notification" />
                <span>공지사항</span>

              </Link>
            </Menu.Item>
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
              popupClassName={styles.popup}
            >

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
              <Link to="/signup">
                <Icon type="setting" />
                <span>설정</span>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/notice">
                <Icon type="safety-certificate" />
                <span>비밀번호 변경</span>

              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link to="/signin">
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
