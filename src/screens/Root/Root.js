// Libs
import React, { Component } from "react";
// Styles
import styles from "./Root.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import Path from "@/components/Home/Path";
import HelloWorld from "@/components/Home/HelloWorld";

/**
 * Root
 *
 * @class Root
 * @extends {Component}
 */
class Root extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.home}>
          {/*<Path />*/}
          <HelloWorld auth={this.props.auth}/>
        </div>
      </Layout>
    );
  }
}

export default Root;
