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
import LoggerAdmin from "../components/@shared/LoggerAdmin";

const InitLogHeight = 100;
const LoggerPadding = 10;
var InitHeight = 640;

// if(window.innerHeight - ( InitHeight + InitLogHeight + LoggerPadding ) < 0) {
//   InitHeight = 550;
// }
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

    InitHeight = window.innerHeight - InitLogHeight - 21,
    this.upperHeight = InitHeight + LoggerPadding;

    this.state = {
      // upperHeight: InitHeight,
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
// childHeight: window.innerHeight - this.upperHeight - 21,
    return (
      <Layout>
        <HeaderAdmin />
        <Resize handleWidth="20px" handleColor="#f0f2f5"
                onResizeStop={this.onChangeMove}
                onResizeWindow={this.onChangeWindow}>
          <ResizeVertical height={ InitHeight + "px" } minHeight="370px">
              <div className={styles.app} >
                <Layout.Content>{children}</Layout.Content>
              </div>
          </ResizeVertical >
          <ResizeVertical minHeight="100px">
            <LoggerAdmin height={this.state.childHeight < InitLogHeight - LoggerPadding ? InitLogHeight - LoggerPadding : this.state.childHeight} />
          </ResizeVertical >
        </Resize>

      </Layout>
    );
  }
}

export default App;
