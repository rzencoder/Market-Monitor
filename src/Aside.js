import React, { Component } from 'react';
import Search from './Search';

const colors = ['#f46036', '#1CABA9', '#2e294e', '#d7263d', '#f2af29', '#0f4c5c'];

const Stock = (props) => {

  const style = {
    background: colors[props.i]
  }

  return (
    <li className="stock" style={style}>
      <i className="fa fa-times close" aria-hidden="true"
         onClick={function(){props.handleRemoveStock(props.stock)}}></i>
      <div className="stock-name">{props.stock.company}</div>
      <div className="stock-code">Code: {props.stock.code}</div>
    </li>
  )
}

class Aside extends Component {

  render () {
    let arr = [];
    if(this.props.stocks){
      this.props.stocks.forEach((stock, i) => {
        arr.push(<Stock stock={stock}
                        key={i}
                        i={i}
                        handleRemoveStock={this.props.handleRemoveStock}
                  />);
      })
    }

    return (
      <div className="aside">
        <h3>Add Stocks</h3>
        <div className="input-container">
          <Search handleNewStock={this.props.handleNewStock}/>
        </div>
        <h3>Current Stocks</h3>
        <ul className="stock-list">
          {this.props.stocks ? arr : ''}
        </ul>
      </div>
    )
  }
}

export default Aside;
