// Libs
import React, { Component } from "react";
// Styles
import styles from "./Notice.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import NoticeCompo from "@/components/Notice/Notice";

/**
 * Notice
 *
 * @class Notice
 * @extends {Component}
 */
class Notice extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.screen}>
          <NoticeCompo auth={this.props.auth}/>
        </div>
      </Layout>
    );
  }
}

export default Notice;
