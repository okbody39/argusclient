// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal, Statistic,
  Table, Input,
} from 'antd';
import Highlighter from 'react-highlight-words';

import Moment from 'react-moment';
import 'moment-timezone';

import { Plus } from 'react-feather';


// Styles
import styles from "./Access.scss";

const moment = require("moment");

/**
 * Access
 *
 * @class Access
 * @extends {Component}
 */
class Access extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
      visible: false,
      accessList: [],
      usedTotalTime: 0,
      usedThisMonthTime: 0,
      usedBeforeMonthTime: 0,
      lastConnectDate: new Date(),
      loading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      window.ipcRenderer.send("access-list", this.props.auth);

      this.setState({
        loading: true,
      });

    }, 500);

    window.ipcRenderer.on("access-list", (event, arg) => {
      let list = arg; // [];

      let usedTotalTime = 0;
      let usedThisMonthTime = 0;
      let usedBeforeMonthTime = 0;

      let lastConnectDate = null;

      var thisMonth = new Date();
      var thisYYYYMM = thisMonth.getFullYear() + "/" + ( thisMonth.getMonth() + 1 );

      var beforeMonth = new Date();
      beforeMonth.setMonth(beforeMonth.getMonth() - 1);
      var beforeYYYYMM = beforeMonth.getFullYear() + "/" + ( beforeMonth.getMonth() + 1 );

      arg.map((a, idx) => {
        let createdAt = new Date(a.createdAt);
        let createdYYYYMM = createdAt.getFullYear() + "/" + ( createdAt.getMonth() + 1 );
        let elapseTime = parseInt(a.content || "0");

        if(lastConnectDate === null && idx > 0 && a.gb === "CLIENT_START") {
          lastConnectDate = createdAt;
        }

        // if(lastConnectDate === null) {
        //   let diff = new Date() - createdAt;
        //   // console.log("====>", diff);
        //   if(diff > 5000) {
        //     lastConnectDate = createdAt;
        //   }
        // }

        usedTotalTime += elapseTime;


        if(createdYYYYMM === thisYYYYMM) {
          usedThisMonthTime += elapseTime;
        }

        if(createdYYYYMM === beforeYYYYMM) {
          usedBeforeMonthTime += elapseTime;
        }

        a.key = a.id;

        switch ( a.gb ) {
          case "CLIENT_START":
            a.gb = "클라이언트";
            a.detail = "클라이언트 접속";
            a.result = "버전: " + a.target;
            break;
          case "CLIENT_END":
            a.gb = "클라이언트";
            a.detail = "클라이언트 종료";
            a.result =  "사용시간: " + a.content + " sec";
            break;
          case "VM_START":
            a.gb = "VM";
            break;
          case "VM_END":
            a.gb = "VM";
            break;
          default:
        }

      });

      this.setState({
        accessList: list,
        loading: false,
        usedTotalTime: usedTotalTime,
        usedThisMonthTime: usedThisMonthTime,
        usedBeforeMonthTime: usedBeforeMonthTime,
        lastConnectDate: lastConnectDate,
      });
    });

  }

  componentWillUnmount() {
    window.ipcRenderer.removeAllListeners('access-list');
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
      .toString()
      .toLowerCase()
      .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : text,
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  handleApply = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };


  render() {
    const columns = [
      {
        title: '일시',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '20%',
        ...this.getColumnSearchProps('createdAt'),
        render: (text, record) => <Moment format="YYYY-MM-DD HH:mm:ss">{text}</Moment>
      },
      {
        title: '구분',
        dataIndex: 'gb',
        key: 'gb',
        width: '15%',
        ...this.getColumnSearchProps('gb'),
      },
      {
        title: '내용',
        dataIndex: 'detail',
        key: 'detail',
        ...this.getColumnSearchProps('detail'),
      },

      {
        title: '접속IP',
        dataIndex: 'ip',
        key: 'ip',
        ...this.getColumnSearchProps('ip'),
      },
      {
        title: '비고',
        dataIndex: 'result',
        key: 'result',
        align: 'result',
        // ...this.getColumnSearchProps('result'),
      },
    ];

    return (
      <div className={styles.container}>
        <Row gutter={16}>
          <Col span={6}>
            <div className={styles.stat}>
              <Statistic title="총 사용 시간" value={moment().startOf('day')
                .seconds(this.state.usedTotalTime)
                .format('H:mm:ss')} />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.stat}>
              <Statistic title="이번달 사용 시간" value={moment().startOf('day')
                .seconds(this.state.usedThisMonthTime)
                .format('H:mm:ss')} />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.stat}>
              <Statistic title="지난달 사용 시간" value={moment().startOf('day')
                .seconds(this.state.usedBeforeMonthTime)
                .format('H:mm:ss')} />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.stat}>
              <Statistic title="최종접속" prefix={<Moment fromNow locale="ko">{this.state.lastConnectDate}</Moment>} value=" "/>
            </div>
          </Col>
        </Row>
        <Table bordered size="middle"
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.accessList}
          pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30']}}
        />
        <Modal
          title="변경 신청"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}

export default Access;
