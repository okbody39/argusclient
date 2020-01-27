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
class Failure extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.screen}>
          <ChangeCompo />
        </div>
      </Layout>
    );
  }
}

export default Failure;
