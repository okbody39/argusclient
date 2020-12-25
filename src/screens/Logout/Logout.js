// Libs
import React, { Component } from "react";
// Styles
import styles from "./Logout.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import LogoutCompo from "@/components/Logout/Logout";

/**
 * Logout
 *
 * @class Logout
 * @extends {Component}
 */
class Logout extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.home}>
          <LogoutCompo />
        </div>
      </Layout>
    );
  }
}

export default Logout;
