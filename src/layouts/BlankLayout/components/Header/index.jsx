import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { createHashHistory } from 'history';
import { Search, Balloon, Button, Message, Notification} from '@alifd/next';
import eventProxy from '../../../../utils/eventProxy';
import { qkcWeb3, convertTokenName2Num } from '../../../../utils/global';
import * as Contracts from '../../../../utils/contracts';
import * as tool from '../../../../utils/global';
import BigNumber from 'bignumber.js';

import styles from './index.module.scss';

export const history = createHashHistory();
const LOGO = require('./images/logo.png');
const ACCOUNT = require('./images/account.png');


export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tokenAuctionActive: true, 
      curAccount: 'No Addr',
      balance: 0,
    };
  }

  componentDidMount = () => {  
    Contracts.initContractObj(tool.qkcWeb3).then(result => {
      if (!result) return;
      qkcWeb3.eth.getAccounts().then(accounts => {
        if (accounts == null || accounts.length == 0) {
          return;
        }
        this.setState({curAccount : accounts[0]});
        Contracts.NonReservedNativeTokenManager.balances(accounts[0]).then(balance => {
          Contracts.NonReservedNativeTokenManager.getAuctionState().then(auctionState => {
            this.setState({balance: auctionState[2] == accounts[0] ? 0 : balance.toString(10)});
          });
        });
      });  
    });
  }

  displayAccountAddr = () => {
    if (this.state.curAccount == null) {
      return 'No Account';
    }
    const len = this.state.curAccount.length;
    return this.state.curAccount.substr(0, 6) + '...' + this.state.curAccount.substr(len - 4);
  }

  onSearchChange(v) {
    this.state.tokenName = v;
  }

  onSearch() {
    const valid = /[0-9A-Z]{5,12}$/.test(this.state.tokenName);
    if (!valid) {
      Notification.config({placement: 'br'});
      Notification.open({
        title: 'Error',
        content: 'Token name only can be a mix of capital letters and numbers with length between 5 and 12.',
        type: 'error',
        duration: 0
      });
      return;
    }
    const tokenId = tool.convertTokenName2Num(this.state.tokenName);
    Contracts.NonReservedNativeTokenManager.getNativeTokenInfo(tokenId).then(tokenInfo => {
      console.log(tokenInfo);
      tokenInfo.createTime = tokenInfo[0].toNumber();
      tokenInfo.owner = tokenInfo[1];
      tokenInfo.totalSupply = tokenInfo[2];
      if (tokenInfo.createTime == 0) {
        Notification.config({placement: 'br'});
        Notification.open({
          title: 'Warning',
          content: 'There is no token with this name.',
          type: 'warning',
          duration: 0
        });
      } else {
        history.push('/Exchange?' + this.state.tokenName);
      }
    });
  }

  showTokenAuction = () => {
    this.setState({tokenAuctionActive: true});
    
    history.push('/');
  }

  showkMyTokens = () => {
    this.setState({tokenAuctionActive: false});
    eventProxy.trigger('pageSelector', {type: 'showMyTokens'});
  }

  handleVisibleChange(visible) {
    if (visible) {
      Contracts.NonReservedNativeTokenManager.balances(this.state.curAccount).then(balance => {
        Contracts.NonReservedNativeTokenManager.getAuctionState().then(auctionState => {
          this.setState({balance: auctionState[2] == this.state.curAccount ? 0 : balance.toString(10)});
        });
      });
    }
  }
  // 提取账户余额
  withdrawAll = () => {
    Contracts.NonReservedNativeTokenManager.withdraw([], {transferTokenId: '0x8bb0'}).then(txId => {
      if (new BigNumber(txId, 16).toNumber() == 0) {
        tool.displayErrorInfo('Fail to send transaction.');
      } else {
        Notification.config({placement: 'br'});
        Notification.open({
            title: 'Result of Transaction',
            content:
            <a href={tool.QuarkChainNetwork + 'tx/' + txId} target='_blank'>Transaction has been sent successfully, please click here to check it.</a>,
            type: 'success',
            duration: 0
        });
      }
    }).catch(error => {
      if (error.code == 4001) return;
      tool.displayErrorInfo(error.message);
    });
  }

  render () {
    const dispayAccount = this.state.curAccount != null ? <a href={tool.QuarkChainNetwork + 'address/' 
                                            + this.state.curAccount + Contracts.NonReservedNativeTokenManager.fullShardKey} target='_blank'>
                                                {tool.displayShortAddr(this.state.curAccount)}
                                            </a>  : 'No Account';
    const accountInfoBtn = <Button className={styles.accountInfo} text iconSize='medium'> {dispayAccount} </Button>
    return (
      <div className={styles.header}>
        <div className={styles.logo}>
          <Link to="/" className={styles.logoLink}>
            <img src={LOGO}/>
          </Link>
        </div>
        <ul className={styles.nav}>
          <li className={styles.navItem}>
            {/* <Button text className={this.state.tokenAuctionActive ? styles.activeNavItemLink : styles.navItemLink} onClick={this.showTokenAuction}>
              Token Auction
            </Button>
                        
            <Button text className={!this.state.tokenAuctionActive ? styles.activeNavItemLink : styles.navItemLink} onClick={this.showkMyTokens}>
              My Tokens
            </Button> */}
            <Search className={styles.searchItem} shape="simple" style={{width: '300px'}} placeholder='Token Names'
                    onChange={this.onSearchChange.bind(this)} onSearch={() => this.onSearch()}/>
          </li>
        </ul>
        
        <ul className={styles.nav}>
          <li className={styles.accountItem}>
            <img src={ACCOUNT} className={styles.accountImg}/>
            <Balloon trigger={accountInfoBtn} closable={false} onVisibleChange={this.handleVisibleChange.bind(this)}>
              <li className={styles.ballonItem}>
                <p>Balance in Contract</p>
                <p>{tool.convert2BaseUnit(this.state.balance)} QKC</p>
                <br/>
                <Button text className={styles.activeNavItemLink} onClick={this.withdrawAll}>
                  Withdraw All
                </Button>
              </li>
            </Balloon>
          </li>
        </ul>
      </div>
    );
  }
}
