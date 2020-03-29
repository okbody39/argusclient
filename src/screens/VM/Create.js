// Libs
import React, { Component } from "react";
// Styles
import styles from "./Create.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import Path from "@/components/Home/Path";
import CreateCompo from "@/components/VM/Create";

/**
 * Create
 *
 * @class Create
 * @extends {Component}
 */
class Create extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.screen}>
          {/*<Path />*/}
          <CreateCompo auth={this.props.auth}/>
        </div>
      </Layout>
    );
  }
}

export default Create;
