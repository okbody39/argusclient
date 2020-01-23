// Libs
import React, { Component } from "react";
import { Layout, Menu, Badge, List, Notification, Avatar } from "antd";
import { Link, withRouter } from 'react-router-dom';
import { Settings, Bell, Triangle, User } from 'react-feather';

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
          <Menu.Item key="/history" >
            <Link to="/">
              신청이력
            </Link>
          </Menu.Item>
          <Menu.Item key="/signin">
            <Link to="/signin">장애이력</Link>
          </Menu.Item>
          <Menu.Item key="menuitem3">로그확인</Menu.Item>
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
          >
            <Menu.Item
              className="p-0 bg-transparent"
              style={{ height: 'auto' }}
            >
              {/*<List*/}
              {/*  className="header-notifications"*/}
              {/*  itemLayout="horizontal"*/}
              {/*  dataSource={notifications}*/}
              {/*  footer={<div>5 Notifications</div>}*/}
              {/*  renderItem={item => (*/}
              {/*    <Notification>*/}
              {/*      <List.Item>*/}
              {/*        <List.Item.Meta*/}
              {/*          avatar={item.avatar}*/}
              {/*          title={<a href="javascript:;">{item.title}</a>}*/}
              {/*          description={<small>{item.description}</small>}*/}
              {/*        />*/}
              {/*      </List.Item>*/}
              {/*    </Notification>*/}
              {/*  )}*/}
              {/*/>*/}
            </Menu.Item>
          </SubMenu>

          <SubMenu
            title={
              <div className={styles.menusubitem}>
                <Settings size={22} strokeWidth={1} />
              </div>
            }
          >
            <Menu.Item>
              <Link to="/signup">
                설정
              </Link>
            </Menu.Item>
            <Menu.Item>공지사항</Menu.Item>
            <Menu.Divider />
            {/*<Menu.Item>*/}
            {/*  <Link href="https://one-readme.fusepx.com">*/}
            {/*    <a>Help?</a>*/}
            {/*  </Link>*/}
            {/*</Menu.Item>*/}
            <Menu.Item>
              <Link to="/signin">
                로그아웃
              </Link>
            </Menu.Item>
          </SubMenu>
        </Menu>

      </Layout.Header>
    );
  }
}

export default withRouter(Header);
