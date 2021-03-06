// Libs
import React, { Component } from "react";
import { Layout } from "antd";
import { Link, withRouter } from 'react-router-dom';

// Styles
import styles from "./Footer.scss";
// Config
import { ISFULLSCREEN } from "@/config";
import icon from "@/assets/images/argus-icon.png"

/**
 * Footer
 *
 * @class Footer
 * @extends {Component}
 */
class Footer extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    if(ISFULLSCREEN(this.props.location.pathname)) {
      return null;
    }

    return (
      <Layout.Footer className={styles.footer}>
        <img alt="" className={styles.logo} src={icon} />
         the Argus ©2019
      </Layout.Footer>
    );
  }
}

export default withRouter(Footer);
