"use strict";

import React, { Component } from "react";
import ReactDOM from "react-dom";

import logo from "../assets/img/github.png";
import "./index.less";
import { common } from "../../common";
import { a } from "./tree-shaking";
console.log(common());

class Search extends Component {
  constructor() {
    super();
    this.state = {
      Text: null
    };
  }
  loadComponent() {
    import("./text").then(Text => {
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

ReactDOM.render(<Search></Search>, document.getElementById("root"));
