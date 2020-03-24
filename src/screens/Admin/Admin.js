// Libs
import React, { Component } from "react";
// Styles
import styles from "./Admin.scss";
// Layouts
import Layout from "@/layouts/AppAdmin";
// Components
import AdminCompo from "@/components/Admin/Admin";

/**
 * Notice
 *
 * @class Admin
 * @extends {Component}
 */
class Admin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.screen}>
          <AdminCompo />
        </div>
      </Layout>
    );
  }
}

export default Admin;
