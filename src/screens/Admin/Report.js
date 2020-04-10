// Libs
import React, { Component } from "react";
// Styles
import styles from "./Report.scss";
// Layouts
import Layout from "@/layouts/AppAdmin";
// Components
import ReportCompo from "@/components/Admin/Report";

/**
 * Report
 *
 * @class Report
 * @extends {Component}
 */
class Report extends Component {
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

export default Report;
