// Libs
import React, { Component } from "react";
import { Button, Checkbox, Form, Input, message, Row, Card } from 'antd';
import { Eye, Mail, Triangle, User, Server } from 'react-feather';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
const FormItem = Form.Item;
const Content = styled.div`
  max-width: 400px;
  z-index: 2;
  min-width: 300px;
`;

const { Meta } = Card;

// Styles
import styles from "./Signup.scss";

import logo from '@/assets/images/seedclient_logo_l.png';

/**
 * Signup
 *
 * @class Signup
 * @extends {Component}
 */
class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // username: "",
      // password: "",
      loading: false,
    };

    // this.history = useHistory();
  }

  handleSubmit(event) {
    const { form } = this.props;

    event.preventDefault();

    form.validateFields((err, values)  => {
      if (!err) {

        let formData = JSON.stringify({
          code: values,
        });

        // console.log(formData);
        this.props.history.push('/signin');

      }
    });
  }

  render() {
    const { form } = this.props;
    // const { getFieldDecorator } = form;

    return (
      <Row
        type="flex"
        align="middle"
        justify="center"
        className="px-3 bg-white mh-page"
        style={{ minHeight: '100vh' }}
      >
        <Content>
          <div className="text-center mb-0">
              {/*<a className="brand mr-0">*/}
                {/*<Link to="/">*/}
                {/*<Triangle size={32} strokeWidth={1} />*/}
                  <img src={logo} className={styles.logo}/>
                {/*</Link>*/}
              {/*</a>*/}
            {/*<h5 className="mb-0 mt-3">SeedADM</h5>*/}
            {/*<p className="text-muted">get started with our service</p>*/}
          </div>

          <Form
            layout="vertical"
            onSubmit={this.handleSubmit.bind(this)}

          >
            <FormItem label="서버 주소">
              {form.getFieldDecorator('serverurl', {
                rules: [
                  {
                    required: true,
                    message: '서버 주소을 입력하세요!'
                  },
                  {
                    type: 'url',
                    message: '서버 주소 형식에 맞지 않습니다.'
                  }
                ]
              })(
                <Input
                  prefix={
                    <Server
                      size={16}
                      strokeWidth={1}
                      style={{ color: 'rgba(0,0,0,.25)' }}
                    />
                  }
                  placeholder="http://127.0.0.1:8080"
                />
              )}
            </FormItem>

            <FormItem>
              <Button type="primary" htmlType="submit" block className="mb-3">
                저장
              </Button>
            </FormItem>

          </Form>
        </Content>
      </Row>
    );
  }
}

export default withRouter(Form.create()(Signup));
