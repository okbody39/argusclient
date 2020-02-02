// Libs
import React, { Component } from "react";
// Styles
import styles from "./Settings.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import SettingsCompo from "@/components/Settings/Settings";

/**
 * Settings
 *
 * @class Settings
 * @extends {Component}
 */
class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.screen}>
          <SettingsCompo />
        </div>
      </Layout>
    );
  }
}

export default Settings;
