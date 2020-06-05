// Libs
import React, { Component } from "react";
// Styles
import styles from "./Network.scss";
// Layouts
import Layout from "@/layouts/AppAdmin";
// Components
import ReportCompo from "@/components/Admin/Network";

/**
 * Network
 *
 * @class Network
 * @extends {Component}
 */
class Network extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.screen}>
          <ReportCompo auth={this.props.auth}/>
        </div>
      </Layout>
    );
  }
}

export default Network;
