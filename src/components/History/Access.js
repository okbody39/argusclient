// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal, Statistic,
  Table, Input,
} from 'antd';
import Highlighter from 'react-highlight-words';

import { Plus } from 'react-feather';


// Styles
import styles from "./Access.scss";

const data = [
  {
    created_at: '2020.01.29 09:23:21',
    type: '로그인',
    detail: 'yglee',
    ip: '192.168.0.121',
    result: '성공',
  },
  {
    created_at: '2020.01.05 10:01:10',
    type: 'VM접속종료',
    detail: 'WIN10-INTERNET',
    ip: '192.168.0.121',
    result: '성공',
  },
  {
    created_at: '2020.01.05 10:01:10',
    type: 'VM접속',
    detail: 'WIN10-INTERNET',
    ip: '192.168.0.121',
    result: '성공',
  },
  {
    created_at: '2020.01.05 10:01:10',
    type: 'VM재기동',
    detail: 'WIN10-INTERNET',
    ip: '192.168.0.121',
    result: '성공',
  },
  {
    created_at: '2020.01.05 10:01:10',
    type: 'VM접속',
    detail: 'WIN10-INTERNET',
    ip: '192.168.0.121',
    result: '실패',
  },
];


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
        dataIndex: 'created_at',
        key: 'created_at',
        width: '20%',
        ...this.getColumnSearchProps('created_at'),
      },
      {
        title: '구분',
        dataIndex: 'type',
        key: 'type',
        width: '20%',
        ...this.getColumnSearchProps('type'),
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
        title: '결과',
        dataIndex: 'result',
        key: 'result',
        align: 'center',
        ...this.getColumnSearchProps('result'),
      },
    ];

    return (
      <div className={styles.container}>
        <Row gutter={16}>
          <Col span={6}>
            <div className={styles.stat}>
              <Statistic title="총 사용 시간" value={112893} />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.stat}>
              <Statistic title="이번달 사용 시간" value={4565} />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.stat}>
              <Statistic title="지난달 사용 시간" value={9756} />
            </div>
          </Col>
          <Col span={6}>
            <div className={styles.stat}>
              <Statistic title="최종접속" value='3일전' />
            </div>
          </Col>
        </Row>
        <Table bordered size="middle"
          columns={columns}
          dataSource={data}
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
