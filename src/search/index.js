import React, { Component } from "react";
import ReactDOM from "react-dom";

import logo from "../assets/img/github.png";
import "./index.less";
import common from "../../common";
import { a } from "./tree-shaking";

common();

class Search extends Component {
  constructor() {
    super();
    this.state = {
      Text: null
    };
  }

  loadComponent() {
    import("./text").then((Text) => {
      this.setState({
        Text: Text.default
      });
    });
  }

  render() {
    const funcA = a();
    const { Text } = this.state;
    return (
      <div className="search-text">
        搜索
        <p>{funcA}</p>
        <p>test</p>
        <div>
          <img src={logo} alt="logo" onClick={this.loadComponent.bind(this)} />
        </div>
        <span>Search Text</span>
        <div className="test">测试数据</div>
        {Text ? <Text /> : null}
      </div>
    );
  }
}

ReactDOM.render(<Search />, document.getElementById("root"));
