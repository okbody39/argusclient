// Libs
import React, { Component } from "react";
// Styles
import styles from "./Failure.scss";
// Layouts
import Layout from "@/layouts/AppAdmin";
// Components
import FailureCompo from "@/components/Admin/Failure";

/**
 * Failure
 *
 * @class Failure
 * @extends {Component}
 */
class Failure extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.screen}>
          <FailureCompo auth={this.props.auth}/>
        </div>
      </Layout>
    );
  }
}

export default Failure;
