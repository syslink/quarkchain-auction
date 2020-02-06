import React, { Component } from 'react';
import { Pagination, Table } from '@alifd/next';
import styles from './index.module.scss';

const nodata = require('./images/nodata.png');

export default class AuctionedTokenData extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tokenData: [],
      start: props.start,
    };
  }
  componentDidMount = () => {
    if (this.state.start) {
      this.state.tokenData = this.generateData(1);
      this.setState({tokenData: this.state.tokenData});
    }
  }

  generateData = (startIndex) => {
    let data = [];
    for (let i = 0; i < 10; i++) {
      data.push({tokenName: 'Satoshi-' + ((startIndex - 1) * 10 + i), price: '100000 QKC', createdTime: '21:42:12 01/22/2020', totalSupply: '10000000', owner: '0xaaaa...bbbb'});
    }
    return data;
  }

  onChange = (currentPage) => {
    this.state.tokenData = this.generateData(currentPage);
    this.setState({tokenData: this.state.tokenData});
  }
  
  render() {
    return (
      <div className={styles.container}>
        <Table className={styles.content} dataSource={this.state.tokenData} isZebra={false} hasBorder={false}
        emptyContent={<img src={nodata} className={styles.imgItem}/>}>
          <Table.Column title='Token Name' dataIndex="tokenName"/>
          <Table.Column title='Auctioned Price' dataIndex="price"/>
          <Table.Column title='Created Time' dataIndex="createdTime"/>
          <Table.Column title='Total Supply' dataIndex="totalSupply"/>
          <Table.Column title='Owner' dataIndex="owner"/>
        </Table>
        {
          !this.state.start ? 
          ''
          :
          <Pagination size='large' hideOnlyOnePage showJump={false} total={100} defaultCurrent={1} shape="no-border" onChange={this.onChange.bind(this)}/> 
        }        
    </div>
    );
  }
}
