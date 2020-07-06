"use strict";

// import { common } from "../../common";
// import { a } from "./tree-shaking";
const React = require("react");
const logo = require("../assets/img/github.png");
require("./index.less");

// console.log(common());

class Search extends React.Component {
  constructor() {
    super();
    this.state = {
      Text: null
    };
  }
  loadComponent() {
    console.log("loadComponent");
    import("./text").then(Text => {
      this.setState({
        Text: Text.default
      });
    });
  }
  render() {
    const { Text } = this.state;

    return (
      <div className="search-text">
        搜索
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

module.exports = <Search />;
