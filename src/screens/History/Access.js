// Libs
import React, { Component } from "react";
// Styles
import styles from "./Access.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import AccessCompo from "@/components/History/Access";

/**
 * Access
 *
 * @class Access
 * @extends {Component}
 */
class Access extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.screen}>
          <AccessCompo auth={this.props.auth}/>
        </div>
      </Layout>
    );
  }
}

export default Access;
