import React, { Component } from "react";
import Chart from "./Chart";
import "./normalize.css";
import "./App.css";
import socketIOClient from "socket.io-client";

import Nav from "./Nav";
import Aside from "./Aside";
const ENDPOINT = "https://marketmonitor.herokuapp.com/";

const socket = socketIOClient(ENDPOINT);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stocks: [],
      loading: true,
    };
    this.handleNewStock = this.handleNewStock.bind(this);
    this.handleRemoveStock = this.handleRemoveStock.bind(this);
  }

  handleNewStock(stock) {
    let arr = this.state.stocks;
    function findStock(item) {
      return item.code === stock.code;
    }
    let index = arr.indexOf(arr.find(findStock));
    if (index === -1 && arr.length < 6) {
      socket.emit("add", stock.code);
      this.setState({
        loading: true,
      });
    }
  }

  handleRemoveStock(stock) {
    socket.emit("delete", stock.code);
    let arr = Array.from(this.state.stocks);
    let index = arr.indexOf(stock);
    arr.splice(index, 1);
    this.setState({
      stocks: arr,
    });
  }

  componentDidMount() {
    socket.emit("initial-load");

    socket.on("initial-stocks", (data) => {
      let dataArr = [];
      data.dataset.data.forEach((d) => {
        dataArr.push([new Date(d[0]).getTime(), d[1]]);
      });
      dataArr.reverse();
      let stock = {
        code: data.dataset.dataset_code,
        company: data.dataset.name.split("(")[0],
        data: dataArr,
      };
      let arr = Array.from(this.state.stocks);
      arr.push(stock);
      this.setState({
        stocks: arr,
        loading: false,
      });
    });
    socket.on("stock-added", (data) => {
      let dataArr = [];
      data.dataset.data.forEach((d) => {
        dataArr.push([new Date(d[0]).getTime(), d[1]]);
      });
      dataArr.reverse();
      let stock = {
        code: data.dataset.dataset_code,
        company: data.dataset.name.split("(")[0],
        data: dataArr,
      };
      let arr = Array.from(this.state.stocks);
      arr.push(stock);
      this.setState({
        stocks: arr,
        loading: false,
      });
    });

    socket.on("stock-deleted", (stock) => {
      let arr = Array.from(this.state.stocks);
      function findStock(item) {
        return item.code === stock;
      }
      var index = arr.indexOf(arr.find(findStock));
      arr.splice(index, 1);
      this.setState({
        stocks: arr,
        loading: false,
      });
    });
  }

  render() {
    return (
      <div className="App">
        <Nav />
        <div className="main-container">
          <Aside
            stocks={this.state.stocks}
            handleNewStock={this.handleNewStock}
            handleRemoveStock={this.handleRemoveStock}
          />
          <div className="content-container">
            <div className="title">
              <p>United States Stock Prices - WIKI Prices</p>
            </div>
            <div className="chart-container">
              {this.state.loading ? (
                <div className="load">
                  <div className="loader"></div>
                </div>
              ) : (
                ""
              )}
              <div id="chart" className="chart">
                {!this.state.loading ? (
                  <Chart stocks={this.state.stocks} />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
