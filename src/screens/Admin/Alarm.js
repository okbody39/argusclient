// Libs
import React, { Component } from "react";
// Styles
import styles from "./Alarm.scss";
// Layouts
import Layout from "@/layouts/AppAdmin";
// Components
import AlarmCompo from "@/components/Admin/Alarm";

/**
 * Alarm
 *
 * @class Alarm
 * @extends {Component}
 */
class Alarm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.screen}>
          <AlarmCompo auth={this.props.auth}/>
        </div>
      </Layout>
    );
  }
}

export default Alarm;
