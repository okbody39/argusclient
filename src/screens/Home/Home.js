// Libs
import React, { Component } from "react";
// Styles
import styles from "./Home.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import Path from "@/components/Home/Path";
import HelloWorld from "@/components/Home/HelloWorld";

/**
 * Home
 *
 * @class Home
 * @extends {Component}
 */
class Home extends Component {
  constructor(props) {
    super(props);

    this.props = props;
  }

  render() {
    return (
      <Layout>
        <div className={styles.home}>
          {/*<Path />*/}
          <HelloWorld  auth={this.props.auth}/>
        </div>
      </Layout>
    );
  }
}

export default Home;
