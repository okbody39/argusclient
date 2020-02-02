// Libs
import React, { Component } from "react";
// Styles
import styles from "./Password.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import PasswordCompo from "@/components/Change/Password";

/**
 * Password
 *
 * @class Password
 * @extends {Component}
 */
class Password extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.screen}>
          <PasswordCompo />
        </div>
      </Layout>
    );
  }
}

export default Password;
