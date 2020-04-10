// Libs
import React, { Component } from "react";
// Styles
import styles from "./Approve.scss";
// Layouts
import Layout from "@/layouts/AppAdmin";
// Components
import ApproveCompo from "@/components/Admin/Approve";

/**
 * Approve
 *
 * @class Approve
 * @extends {Component}
 */
class Approve extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.screen}>
          <ApproveCompo auth={this.props.auth}/>
        </div>
      </Layout>
    );
  }
}

export default Approve;
