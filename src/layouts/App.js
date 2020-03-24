// Libs
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";
import { Resize, ResizeVertical, ResizeHorizon } from "react-resize-layout";
// Styles
import styles from "./App.scss";
// Components
import Header from "@/components/@shared/Header";
import HeaderAdmin from "@/components/@shared/HeaderAdmin";
// import Footer from "@/components/@shared/Footer";
import Logger from "../components/@shared/Logger";

const LoggerPadding = 10;

/**
 * App
 *
 * @class App
 * @extends {Component}
 */
class App extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  constructor(props) {
    super(props);

    this.upperHeight = 640 + LoggerPadding;

    this.state = {
      // upperHeight: 640,
      childHeight: window.innerHeight - this.upperHeight - 21,
    }
  }

  componentDidMount() {
    //
    // console.log(window.innerHeight);

    window.addEventListener('resize', this.setHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setHeight);
  }

  onChangeMove = (event) => {
    if(event.resizeChilds.length) {
      // console.log(event.resizeChilds[0].height, event.resizeChilds[1].height);
      this.upperHeight = event.resizeChilds[0].height + LoggerPadding;
      this.setState({
        // upperHeight: event.resizeChilds[0].height,
        childHeight: event.resizeChilds[1].height - LoggerPadding,
      });
    }
  };

  setHeight = () => {
    this.setState({
      childHeight: window.innerHeight - this.upperHeight - 21,
    });
  };

  onChangeWindow = (event) => {

    if(event.resizeChilds.length) {

      this.upperHeight = event.resizeChilds[0].height + LoggerPadding;
      // console.log(event.resizeChilds[0].height, event.resizeChilds[1].height);

      // this.setState({
      //   upperHeight: event.resizeChilds[0].height,
      //   // childHeight: event.resizeChilds[1].height,
      // });
    }
  };

  render() {
    const { children } = this.props;

    return (
      <Layout>
        <Header />
        <Resize handleWidth="20px" handleColor="#f0f2f5"
                onResizeStop={this.onChangeMove}
                onResizeWindow={this.onChangeWindow}>
          <ResizeVertical height="640px" minHeight="370px">
              <div className={styles.app}>
                <Layout.Content>{children}</Layout.Content>
              </div>
          </ResizeVertical >
          <ResizeVertical minHeight="100px">
            <Logger height={this.state.childHeight < 100 - LoggerPadding ? 100 - LoggerPadding : this.state.childHeight} />
          </ResizeVertical >
        </Resize>

      </Layout>
    );
  }
}

export default App;
