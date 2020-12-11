// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal,
  Table, Input, Select,
} from 'antd';
const { Option } = Select;

import Highlighter from 'react-highlight-words';
import Moment from 'react-moment';
import 'moment-timezone';

import { Plus } from 'react-feather';

import { withRouter } from 'react-router-dom';
// Styles
import styles from "./Change.scss";

const _DICT_ = {
  "CHANGE_RESOURCE": "자원 증설",
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
 * Change
 *
 * @class Change
 * @extends {Component}
 */
class Change extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
      visible: false,
      changeList: [],
      loading: true,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      window.ipcRenderer.send("change-list", this.props.auth);

      this.setState({
        loading: true,
      });

    }, 500);

    window.ipcRenderer.on("change-list", (event, arg) => {
      let list = arg; // [];

      arg.map((a) => {
        //
      });

      this.setState({
        changeList: list,
        loading: false,
      });
    });

  }

  componentWillUnmount() {
    window.ipcRenderer.removeAllListeners('change-list');
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
    this.props.history.push('/change');
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleChange = e => {
    this.props.history.push('/change');

    // // this.setState({
    // //   visible: false,
    // // });
  };


  render() {
    const columns = [
      {
        title: '날짜',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: '15%',
        align: 'center',
        ...this.getColumnSearchProps('createdAt'),
        render: (text, record) => <Moment format="YYYY-MM-DD HH:mm:ss">{text}</Moment>
      },
      {
        title: '변경항목',
        dataIndex: 'gb',
        key: 'gb',
        width: '20%',
        filters: [
          { text: '자원변경', value: 'CHANGE_RESOURCE'},
          { text: 'IP변경', value: 'CHANGE_IP'},
        ],
        onFilter: (value, record) => record.gb.indexOf(value) === 0,
        render: (text, record) => <div>{getDictValue(text)}</div>
      },
      {
        title: '내용',
        dataIndex: 'content',
        key: 'content',
        ...this.getColumnSearchProps('content'),
        render: (text, record) => {
          let json = JSON.parse(text);
          let vmId = json.vmId;
          delete json.vmId;

          return (<div>{vmId}<br/>{JSON.stringify(json)}</div>);
        }
      },
      {
        title: '결과',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        align: 'center',
        filters: [
          { text: '신청', value: 'APPLY'},
          { text: '완료', value: 'DONE'},
          { text: '진행중', value: 'DOING'},
          { text: '거절', value: 'REJECT'},
        ],
        onFilter: (value, record) => record.status.indexOf(value) === 0,
        render: (text, record) => <div>{getDictValue(text)}</div>
      },
    ];

    return (
      <div className={styles.historychange}>
        <Card
          style={{marginBottom: 10 }}
          // type="inner"
          bodyStyle={{padding: 0}}
          bordered={false}
          title="변경관리"
          extra={
            <Button onClick={this.handleChange} type="link">
              변경신청 하기
            </Button>
          }
        ></Card>

        <Table bordered
          loading={this.state.loading}
          columns={columns}
          dataSource={this.state.changeList}
          pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30']}}
               size="middle"
        />
        {/*<Modal*/}
        {/*  title="변경 신청"*/}
        {/*  visible={this.state.visible}*/}
        {/*  onOk={this.handleOk}*/}
        {/*  onCancel={this.handleCancel}*/}
        {/*>*/}
        {/*  <p>대상 VM 선택</p>*/}
        {/*  <Select defaultValue="WIN10-INTERNETVM" style={{ width: 300 }} onChange={this.handleChange}>*/}
        {/*    <Option value="WIN10-INTERNETVM">WIN10-INTERNETVM</Option>*/}
        {/*    <Option value="WIN10-INTERNETVM2">WIN10-INTERNETVM2</Option>*/}
        {/*    <Option value="WIN10-INTERNETVM3">WIN10-INTERNETVM3</Option>*/}
        {/*  </Select>*/}
        {/*</Modal>*/}
      </div>
    );
  }
}

export default withRouter(Change);
