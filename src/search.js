"use strict";

import React, { Component } from "react";
import ReactDOM from "react-dom";

import logo from "./assets/img/github.png";
import "./search.less";

class Search extends Component {
  render() {
    return (
      <div className="search-text">
        搜d索ss
        <img src={logo} alt="logo" />
        Search Text
        <div className="test">测试数据</div>
      </div>
    );
  }
}

ReactDOM.render(<Search></Search>, document.getElementById("root"));
