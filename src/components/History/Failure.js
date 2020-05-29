// Libs
import React, { Component } from "react";
import { withRouter } from 'react-router-dom';
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal, Select,
  Table, Input,
} from 'antd';
const { Option } = Select;

import Highlighter from 'react-highlight-words';
import Moment from 'react-moment';
import 'moment-timezone';

import { Plus } from 'react-feather';


// Styles
import styles from "./Failure.scss";

const _DICT_ = {
  "DIAGNOSIS": "진단",
  "CHANGE_IP": "IP 변경",
  "APPLY": "신청",
  "DONE": "완료",
  "DOING": "진행중",
  "REJECT": "거절",
};
const getDictValue = (key) => {
  return _DICT_[key];
}

/**
 * Failure
 *
 * @class Failure
 * @extends {Component}
 */
class Failure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
      visible: false,
      failureList: [],
      loading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      window.ipcRenderer.send("failure-list", this.props.auth);

      this.setState({
        loading: true,
      });

    }, 500);

    window.ipcRenderer.on("failure-list", (event, arg) => {
      let list = arg; // [];

      arg.map((a) => {
        //
      });

      this.setState({
        failureList: list,
        loading: false,
      });
    });

  }

  componentWillUnmount() {
    window.ipcRenderer.removeAllListeners('failure-list');
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

  handleChange = e => {
    this.props.history.push('/failure');

    // // this.setState({
    // //   visible: false,
    // // });
  };

  // handleOk = e => {
  //   this.props.history.push('/failure');

  //   // this.setState({
  //   //   visible: false,
  //   // });
  // };

  // handleCancel = e => {
  //   console.log(e);
  //   this.setState({
  //     visible: false,
  //   });
  // };


  render() {
    const columns = [
      {
        title: '일시',
        dataIndex: 'createdAt',
        key: 'createdAt',
        // width: '20%',
        ...this.getColumnSearchProps('createdAt'),
        render: (text, record) => <Moment format="YYYY-MM-DD HH:mm:ss">{text}</Moment>
      },
      {
        title: '유형',
        dataIndex: 'gb',
        key: 'gb',
        align: 'center',
        // width: '20%',
        ...this.getColumnSearchProps('gb'),
      },
      {
        title: '세부내용',
        dataIndex: 'content',
        key: 'content',
        ...this.getColumnSearchProps('content'),
      },
      {
        title: '상태',
        dataIndex: 'status',
        align: 'center',
        key: 'status',
        ...this.getColumnSearchProps('status'),
        render: (text, record) => <div>{getDictValue(text)}</div>
      },
      {
        title: '조치결과',
        dataIndex: 'result',
        key: 'result',
        ...this.getColumnSearchProps('result'),
        render: (text, record) => <div>{getDictValue(text)}</div>
      },
      {
        title: '작업자',
        dataIndex: 'worker',
        align: 'center',
        key: 'worker',
        ...this.getColumnSearchProps('worker'),
      },
    ];

    return (
      <div className={styles.container}>
        <Card
          style={{marginBottom: 10 }}
          // type="inner"
          bodyStyle={{padding: 0}}
          bordered={false}
          title="장애신고"
          extra={
            <Button onClick={this.handleChange} type="link">
              신고하기
            </Button>
          }
        ></Card>

        {/* <Button onClick={this.handleApply} type="danger" style={{ marginBottom: 16 }}>
          장애신고 하기
        </Button> */}
        <Table bordered size="middle"
               loading={this.state.loading}
              columns={columns}
              dataSource={this.state.failureList}
              pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30']}}
        />
        {/* <Modal
          title="장애 신고"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>대상 VM 선택</p>
          <Select defaultValue="WIN10-INTERNETVM" style={{ width: 300 }} onChange={this.handleChange}>
            <Option value="WIN10-INTERNETVM">WIN10-INTERNETVM</Option>
            <Option value="WIN10-INTERNETVM2">WIN10-INTERNETVM2</Option>
            <Option value="WIN10-INTERNETVM3">WIN10-INTERNETVM3</Option>
          </Select>
        </Modal> */}
      </div>
    );
  }
}

export default withRouter(Failure);
