// Libs
import React, { Component } from "react";
// Styles
import styles from "./Signin.scss";
// Layouts
import Layout from "@/layouts/App";
// Components
import SigninCompo from "@/components/Signin/Signin";

/**
 * Signin
 *
 * @class Signin
 * @extends {Component}
 */
class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Layout>
        <div className={styles.home}>
          <SigninCompo />
        </div>
      </Layout>
    );
  }
}

export default Signin;
