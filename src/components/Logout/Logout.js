// Libs
import React, {Component, useReducer} from "react";
import { Button, Checkbox, Form, Input, message, Row, Card, notification } from 'antd';
import { Eye, Mail, Triangle, User, Shield } from 'react-feather';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
const FormItem = Form.Item;
const Content = styled.div`
  max-width: 400px;
  z-index: 2;
  min-width: 300px;
`;
import LoadingOverlay from 'react-loading-overlay';
import BounceLoader from 'react-spinners/BounceLoader'
import PuffLoader from 'react-spinners/PuffLoader'

const { Meta } = Card;

// Styles
import styles from "./Logout.scss";

/**
 * Logout
 *
 * @class Logout
 * @extends {Component}
 */
class Logout extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };
    }

    componentDidMount() {
        setTimeout(() => {
            window.ipcRenderer.sendSync("logout-sync");
            this.props.history.push("/signin");
        }, 500);
    }

    componentWillUnmount() {
    }

    render() {
        return (
            <></>
        );
    }
}

export default withRouter(Form.create()(Logout));
