"use strict";

import React, { Component } from "react";
import ReactDOM from "react-dom";

import logo from "../assets/img/github.png";
import "./index.less";
import { common } from "../../common";
import { a } from "./tree-shaking";
console.log(common());

class Search extends Component {
  render() {
    const funcA = a();
    return (
      <div className="search-text">
        搜d索ss{funcA}
        <img src={logo} alt="logo" />
        Search Text
        <div className="test">测试数据</div>
      </div>
    );
  }
}

ReactDOM.render(<Search></Search>, document.getElementById("root"));
