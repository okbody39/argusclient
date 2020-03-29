// Libs
import React, { Component } from "react";
// Styles
import styles from "./Change.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import ChangeCompo from "@/components/Change/Change";

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
        <div className={styles.screen}>
          <ChangeCompo auth={this.props.auth}/>
        </div>
      </Layout>
    );
  }
}

export default Change;
