// Libs
import React, { Component } from "react";
// Styles
import styles from "./Client.scss";
// Layouts
import Layout from "@/layouts/AppAdmin";
// Components
import ClientCompo from "@/components/Admin/Client";

/**
 * Client
 *
 * @class Client
 * @extends {Component}
 */
class Client extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.screen}>
          <ClientCompo auth={this.props.auth}/>
        </div>
      </Layout>
    );
  }
}

export default Client;
