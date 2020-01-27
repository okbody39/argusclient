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

import { Plus } from 'react-feather';


// Styles
import styles from "./Failure.scss";

const data = [
  {
    created_at: '2020.01.28 09:23:04',
    type: '접속 장애',
    detail: 'WIN10-INTERNETVM 접속 장애',
    status: '작업중',
    result: '-',
    worker: '-',
  },
  {
    created_at: '2019.11.28 09:23:04',
    type: '접속 장애',
    detail: 'WIN10-INTERNETVM 접속 장애',
    status: '완료',
    result: 'VM재기동',
    worker: 'SELF',
  },

];


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
    };
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
    // this.props.history.push('/failure');
    //
    // // this.setState({
    // //   visible: false,
    // // });
  };

  handleOk = e => {
    this.props.history.push('/failure');

    // this.setState({
    //   visible: false,
    // });
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
        dataIndex: 'created_at',
        key: 'created_at',
        // width: '20%',
        ...this.getColumnSearchProps('created_at'),
      },
      {
        title: '유형',
        dataIndex: 'type',
        key: 'type',
        // width: '20%',
        ...this.getColumnSearchProps('type'),
      },
      {
        title: '세부내용',
        dataIndex: 'detail',
        key: 'detail',
        ...this.getColumnSearchProps('detail'),
      },
      {
        title: '상태',
        dataIndex: 'status',
        key: 'status',
        ...this.getColumnSearchProps('status'),
      },
      {
        title: '조치결과',
        dataIndex: 'result',
        key: 'result',
        ...this.getColumnSearchProps('result'),
      },
      {
        title: '작업자',
        dataIndex: 'worker',
        key: 'worker',
        ...this.getColumnSearchProps('worker'),
      },
    ];

    return (
      <div className={styles.container}>
        <Button onClick={this.handleApply} type="danger" style={{ marginBottom: 16 }}>
          장애신고 하기
        </Button>
        <Table bordered
          columns={columns}
          dataSource={data}
          pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30']}}
        />
        <Modal
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
        </Modal>
      </div>
    );
  }
}

export default withRouter(Failure);
