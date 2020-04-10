// Libs
import React, { Component } from "react";
import {
  Card, Row, Col, Drawer, Button, Descriptions, Divider, Switch,
  Upload, Icon, message, Badge, Alert, Modal,
  Table, Input, Form,
} from 'antd';
const FormItem = Form.Item;
import Highlighter from 'react-highlight-words';

import {Plus, Server} from 'react-feather';


// Styles
import styles from "./Notice.scss";
import {withRouter} from "react-router-dom";

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
      editor: false,
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
    // console.log(recored);
    this.setState({
      visible: true,
      selectedNotice: recored,
    });
  };

  handleEditor  = () => {



    this.setState({
      editor: true,
    });
  };

  handleEditorCancel = e => {
    this.setState({
      editor: false,
    });
  };

  handleSubmit(event) {
    const { form } = this.props;

    event.preventDefault();

    form.validateFields((err, values)  => {
      if (!err) {

        // let formData = JSON.stringify({
        //   code: values,
        // });

        console.log(values);
        // this.props.history.push('/signin');

        form.resetFields();

        this.setState({
          loading: true,
          editor: false,
        });

        // console.log("submit", values);

        // ipcRenderer.send('setting-update', values);


      }
    });
  }

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { form } = this.props;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 19 },
    };

    const columns = [
      {
        title: 'No',
        dataIndex: 'id',
        key: 'id',
        align:'center',
        width: '8%',
      },
      {
        title: '제목',
        dataIndex: 'title',
        // key: 'title',
        // width: '20%',
        render: (text, record) => <div><a onClick={this.handleDetail.bind(this, record)}>{text}</a><Badge count="N" className="ml-2" /></div>,
        ...this.getColumnSearchProps('title'),
      },
      {
        title: '첨부',
        dataIndex: 'attach',
        key: 'attach',
        align:'center',
        width: '7%',
      },
      {
        title: '조회수',
        dataIndex: 'views',
        key: 'views',
        align:'center',
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
        align:'center',
        width: '15%',
      },
    ];

    return (
      <div className={styles.container}>
        <Card
          style={{marginBottom: 10 }}
          // type="inner"
          bodyStyle={{padding: 0}}
          bordered={false}
          title="공지사항"
          extra={
            <Button onClick={this.handleEditor} type="link">
              작성하기
            </Button>
          }
        ></Card>
        <Table
          bordered
          columns={columns}
          dataSource={data}
          size="middle"
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
        <Modal
          title="공지사항 작성"
          visible={this.state.editor}
          // onOk={this.handleSubmit}
          okButtonProps={{form:'editor-form', key: 'submit', htmlType: 'submit'}}
          onCancel={this.handleEditorCancel}
        >
          <Form
            {...formItemLayout}
            id='editor-form'
            onSubmit={this.handleSubmit.bind(this)}
          >
            <FormItem label="제목">
              {form.getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '제목을 입력하세요!'
                  },
                  // {
                  //   type: 'url',
                  //   message: '서버 주소 형식에 맞지 않습니다.'
                  // }
                ]
              })(
                <Input
                  placeholder="공지사항 제목"
                />
              )}
            </FormItem>
            <FormItem label="내용">
              {form.getFieldDecorator('body', {
                rules: [
                  {
                    required: true,
                    message: '내용을 입력하세요!'
                  },
                  // {
                  //   type: 'url',
                  //   message: '서버 주소 형식에 맞지 않습니다.'
                  // }
                ]
              })(
                <Input.TextArea rows={4}
                  placeholder="공지사항 내용"
                />
              )}
            </FormItem>
            <FormItem label="상위고정" valuePropName="checked">
              {form.getFieldDecorator('top', {
                initialValue: false,
              })(
                <Switch />
              )}
            </FormItem>
            <Form.Item label="파일첨부" extra="" >
              {form.getFieldDecorator('upload', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload name="logo" action="/upload.do" listType="picture">
                  <Button>
                    <Icon type="upload" />Click to upload
                  </Button>
                </Upload>,
              )}
            </Form.Item>
            {/*<Form.Item wrapperCol={{ span: 12, offset: 6 }}>*/}
            {/*  <Button type="primary" htmlType="submit" loading={this.state.loading}>*/}
            {/*    저장*/}
            {/*  </Button>*/}
            {/*  <Button type="danger" htmlType="button" onClick={this.handleReset.bind(this)}>*/}
            {/*    초기화*/}
            {/*  </Button>*/}
            {/*</Form.Item>*/}
            {/* <FormItem>
              <Button type="primary" htmlType="submit" block className="mb-3" loading={this.state.loading}>
                저장
              </Button>
            </FormItem> */}

          </Form>
        </Modal>
      </div>
    );
  }
}

export default withRouter(Form.create()(Notice));
