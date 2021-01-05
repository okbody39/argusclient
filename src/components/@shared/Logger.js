// Libs
import React, { Component } from "react";
import { Layout, Row, Col } from "antd";
import { Link, withRouter } from 'react-router-dom';

// Styles
import styles from "./Logger.scss";
// Config
import { ISFULLSCREEN } from "@/config";

Date.prototype.format = function(f) {
  if (!this.valueOf()) return " ";

  var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  var d = this;

  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
      switch ($1) {
          case "yyyy": return d.getFullYear();
          case "yy": return (d.getFullYear() % 1000).zf(2);
          case "MM": return (d.getMonth() + 1).zf(2);
          case "dd": return d.getDate().zf(2);
          case "E": return weekName[d.getDay()];
          case "HH": return d.getHours().zf(2);
          case "hh": return (h = d.getHours() % 12 ? h : 12).zf(2);
          case "mm": return d.getMinutes().zf(2);
          case "ss": return d.getSeconds().zf(2);
          case "a/p": return d.getHours() < 12 ? "오전" : "오후";
          default: return $1;
      }
  });
};
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

/**
 * Footer
 *
 * @class Footer
 * @extends {Component}
 */
class Footer extends Component {
  constructor(props) {
    super(props);

    // localStorage.removeItem("ARGUS.LOGS");

    this.state = {
      logs: JSON.parse(localStorage.getItem("ARGUS.LOGS")) || [],
    };
  }

  componentDidMount() {

    window.ipcRenderer.on("log-message", (event, arg) => {
      let log = new Date().format("yyyy-MM-dd HH:mm:ss") + " - " + arg;

      this.setState({
        logs: [log, ...this.state.logs],
      });

      let logs = this.state.logs;
      if (logs.length >= 100){
        logs.pop();
      }

      localStorage.setItem("ARGUS.LOGS",  JSON.stringify(logs));

      //  console.log(localStorage.getItem("ARGUS.LOGS"));
      // this.logViewer.style.background = "transparent";

      this.newData.scrollIntoView({ behavior: "smooth" });
    });

    // this.newData.scrollIntoView({ behavior: "smooth" });
  }

  componentWillUnmount() {
    window.ipcRenderer.removeAllListeners('log-message');
  }

  render() {

    if(ISFULLSCREEN(this.props.location.pathname)) {
      return null;
    }

    return (
      <Layout.Footer className={styles.logger}>
        <div className={styles.log_viewer} style={{height: this.props.height}}>
          <div ref={(ref) => this.newData = ref} />
          <ul>
            {this.state.logs.map((item, i) => (<li key={`item_${i}`}>{ item }</li>))}
          </ul>
        </div>
      </Layout.Footer>
    );
  }
}

export default withRouter(Footer);
