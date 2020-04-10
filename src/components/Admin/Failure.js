// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal,
  Table, Input, Select,
} from 'antd';
const { Option } = Select;

import Highlighter from 'react-highlight-words';

import { Plus } from 'react-feather';

import { withRouter } from 'react-router-dom';
// Styles
import styles from "./Failure.scss";

const data = [
  {
    created_at: '2019.12.30',
    type: '자원변경',
    detail: 'CPU: 3Ccore, Memory: 2G 증설',
    result: '완료',
  },
  {
    created_at: '2019.11.30',
    type: '최초생성',
    detail: 'Windows10',
    result: '완료',
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
    // this.props.history.push('/failure');
    //
    // // this.setState({
    // //   visible: false,
    // // });
  };


  render() {
    const columns = [
      {
        title: '날짜',
        dataIndex: 'created_at',
        key: 'created_at',
        width: '15%',
        align: 'center',
        ...this.getColumnSearchProps('created_at'),
      },
      {
        title: '변경항목',
        dataIndex: 'type',
        key: 'type',
        width: '20%',
        filters: [
          { text: '자원변경', value: '자원변경'},
          { text: '권한신청', value: '권한신청'},
          { text: '최초생성', value: '최초생성'},
        ],
        onFilter: (value, record) => record.type.indexOf(value) === 0,
      },
      {
        title: '내용',
        dataIndex: 'detail',
        key: 'detail',
        ...this.getColumnSearchProps('detail'),
      },
      {
        title: '결과',
        dataIndex: 'result',
        key: 'result',
        width: '10%',
        align: 'center',
        filters: [
          { text: '완료', value: '완료'},
          { text: '진행중', value: '진행중'},
          { text: '거절', value: '거절'},
        ],
        onFilter: (value, record) => record.result.indexOf(value) === 0,
      },
    ];

    return (
      <div className={styles.historychange}>
        <Card
          style={{marginBottom: 10 }}
          // type="inner"
          bodyStyle={{padding: 0}}
          bordered={false}
          title="장애처리"
          extra={
            <Button onClick={this.handleApply} type="link">
              장애처리하기
            </Button>
          }
        ></Card>

        <Table bordered
          columns={columns}
          dataSource={data}
          pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30']}}
               size="middle"
        />
        <Modal
          title="변경 신청"
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
