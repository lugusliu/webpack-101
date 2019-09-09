"use strict";

import React, { Component } from "react";
import ReactDOM from "react-dom";

import "./search.less";

class Search extends Component {
  render() {
    return <div className="search-text">Search Text</div>;
  }
}

ReactDOM.render(<Search></Search>, document.getElementById("root"));
