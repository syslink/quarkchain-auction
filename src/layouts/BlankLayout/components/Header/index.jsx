import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Search, Balloon, Button} from '@alifd/next';
import eventProxy from '../../../../utils/eventProxy';

import styles from './index.module.scss';

const LOGO = require('./images/logo.png');
const ACCOUNT = require('./images/account.png');


export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tokenAuctionActive: true, 
    };
  }

  componentDidMount = () => {

  }

  
  onSearch() {
    
  }

  showTokenAuction = () => {
    this.setState({tokenAuctionActive: true});
    eventProxy.trigger('pageSelector', 'showTokenAuction');
  }

  showkMyTokens = () => {
    this.setState({tokenAuctionActive: false});
    eventProxy.trigger('pageSelector', 'showMyTokens');
  }

  render () {
    const accountInfoBtn = <Button className={styles.accountInfo} text iconSize='medium'> 0xaaaa...bbbb </Button>
    return (
      <div className={styles.header}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            <img src={LOGO}/>
          </Link>
        </div>
        <ul className={styles.nav}>
          <li className={styles.navItem}>
            <Button text className={this.state.tokenAuctionActive ? styles.activeNavItemLink : styles.navItemLink} onClick={this.showTokenAuction}>
              Token Auction
            </Button>
            
            <Button text className={!this.state.tokenAuctionActive ? styles.activeNavItemLink : styles.navItemLink} onClick={this.showkMyTokens}>
              My Tokens
            </Button>
            <Search className={styles.searchItem} shape="simple" style={{width: '200px'}} placeholder='Token Names' onSearch={() => this.onSearch()}/>
          </li>
        </ul>
        
        <ul className={styles.nav}>
          <li className={styles.accountItem}>
            <img src={ACCOUNT} className={styles.accountImg}/>
            <Balloon trigger={accountInfoBtn} closable={false}>
              <li className={styles.ballonItem}>
                <p>Contract Balance</p>
                <p>6000 QKC</p>
                <br/>
                <Link to="/" className={styles.activeNavItemLink}>
                  Withdraw All
                </Link>
              </li>
            </Balloon>
          </li>
        </ul>
      </div>
    );
  }
}
