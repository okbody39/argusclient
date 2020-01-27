// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal,
  Table, Input,
} from 'antd';
import Highlighter from 'react-highlight-words';

import { Plus } from 'react-feather';


// Styles
import styles from "./Notice.scss";

const data = [
  {
    id: '1',
    title: '시스템 정검 안내 (설연휴)',
    attach: '',
    views: '1,252',
    created_at: '10:23',
    content: '시스템 점검을 설연휴 합니다.',
  },
  {
    id: '2',
    title: '설맞이 쿠폰 이벤트',
    attach: '',
    views: '197',
    created_at: '2020.01.27',
    content: '설맞이 쿠폰 이벤트 합니다.',
  },
  {
    id: '3',
    title: '센터 이전 안내',
    attach: '',
    views: '256',
    created_at: '2020.01.27',
    content: '시스템 점검을 센터 이전 안내 합니다.',
  },
  {
    id: '4',
    title: '시스템 이용 안내',
    attach: '',
    views: '156',
    created_at: '2020.01.27',
    content: '시스템 점검을 시스템 이용 안내 합니다.',
  },

];


/**
 * Notice
 *
 * @class Notice
 * @extends {Component}
 */
class Notice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      searchedColumn: '',
      selectedNotice: null,
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
    // render: text =>
    //   this.state.searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
    //       searchWords={[this.state.searchText]}
    //       autoEscape
    //       textToHighlight={text.toString()}
    //     />
    //   ) : text,
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

  handleDetail  = recored => {
    console.log(recored);
    this.setState({
      visible: true,
      selectedNotice: recored,
    });
  };


  render() {
    const columns = [
      {
        title: 'No',
        dataIndex: 'id',
        key: 'id',
        width: '10%',
      },
      {
        title: '제목',
        dataIndex: 'title',
        // key: 'title',
        // width: '20%',
        render: (text, record) => <div><a onClick={this.handleDetail.bind(this, record)}>{text}</a><Badge count="New" className="ml-2" /></div>,
        ...this.getColumnSearchProps('title'),
      },
      {
        title: '첨부',
        dataIndex: 'attach',
        key: 'attach',
        width: '7%',
      },
      {
        title: '조회수',
        dataIndex: 'views',
        key: 'views',
        width: '10%',
      },
      // {
      //   title: '글쓴이',
      //   dataIndex: 'username',
      //   key: 'username',
      //   width: '10%',
      //   ...this.getColumnSearchProps('username'),
      // },
      {
        title: '날짜',
        dataIndex: 'created_at',
        key: 'created_at',
        width: '17%',
      },
    ];

    return (
      <div className={styles.container}>
        <Table bordered={false}
          columns={columns}
          dataSource={data}
          // pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '30']}}
        />
        <Modal
          title={this.state.selectedNotice && this.state.selectedNotice.title || ""}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <p>{this.state.selectedNotice && this.state.selectedNotice.created_at || ""}</p>
          <p>{this.state.selectedNotice && this.state.selectedNotice.content || ""}</p>
        </Modal>
      </div>
    );
  }
}

export default Notice;
