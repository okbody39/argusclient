// Libs
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Layout } from "antd";
import { Resize, ResizeVertical, ResizeHorizon } from "react-resize-layout";
// Styles
import styles from "./App.scss";
// Components
import Header from "@/components/@shared/Header";
// import Footer from "@/components/@shared/Footer";
import Logger from "../components/@shared/Logger";

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

    this.state = {
      childHeights: [
        {height: 640},
        {height: window.innerHeight - 640 - 21}
      ],
    }
  }

  componentDidMount() {
    // 
    console.log(window.innerHeight);
  }

  onChangeSize = (event) => {

    // console.log(event.resizeChilds, window.innerWidth, window.innerHeight);

    this.setState({
      childHeights: event.resizeChilds
    })
  }

  render() {
    const { children } = this.props;

    return (
      <Layout>
        <Header />
        <Resize handleWidth="20px" handleColor="#f0f2f5" onResizeStop={this.onChangeSize}>
          <ResizeVertical height="640px" minHeight="370px" ref={(ref) => this.mainContent = ref}>
              <div className={styles.app}>
                <Layout.Content>{children}</Layout.Content>
              </div>
          </ResizeVertical >
          <ResizeVertical minHeight="100px">
            <Logger height={this.state.childHeights[1].height} />
          </ResizeVertical >
        </Resize>
        
      </Layout> 
    );
  }
}

export default App;
