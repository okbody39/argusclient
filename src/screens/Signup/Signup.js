// Libs
import React, { Component } from "react";
// Styles
import styles from "./Signup.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import SignupCompo from "@/components/Signup/Signup";

/**
 * Signup
 *
 * @class Signup
 * @extends {Component}
 */
class Signup extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.home}>
          <SignupCompo />
        </div>
      </Layout>
    );
  }
}

export default Signup;
