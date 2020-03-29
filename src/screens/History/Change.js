// Libs
import React, { Component } from "react";
// Styles
import styles from "./Change.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import Path from "@/components/Home/Path";
import ChangeCompo from "@/components/History/Change";

/**
 * Change
 *
 * @class Change
 * @extends {Component}
 */
class Change extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.home}>
          <ChangeCompo auth={this.props.auth}/>
        </div>
      </Layout>
    );
  }
}

export default Change;
